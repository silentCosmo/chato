'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { rtcConfig } from '@/lib/webrtc/config';
import {
  initiateCall,
  answerCall,
  declineCall,
  cleanupCall,
  sendIceCandidate,
  listenToCallState,
  listenToIceCandidates,
} from '@/lib/webrtc/signaling';

export const useWebRTCCall = ({ chatRoomId, userId, peerUserId, roomMatchType }) => {
  const [callState, setCallState] = useState('idle');
  // 'idle' | 'calling' | 'incoming' | 'connecting' | 'connected' | 'declined' | 'ended' | 'failed' | 'permission_denied'
  const [callType, setCallType] = useState(null); // 'audio' | 'video'
  const [callerId, setCallerId] = useState(null);
  const [calleeId, setCalleeId] = useState(null);
  const [role, setRole] = useState(null); // 'caller' | 'callee'

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const listenersRef = useRef([]);
  const iceCandidatesQueueRef = useRef([]);
  const processedCandidatesRef = useRef(new Set());
  const iceTimeoutRef = useRef(null);
  const currentOfferRef = useRef(null);
  const activeCallIdRef = useRef(null);

  // Sync refs for transient values
  const roomMatchTypeRef = useRef(roomMatchType);
  useEffect(() => {
    roomMatchTypeRef.current = roomMatchType;
  }, [roomMatchType]);

  const peerUserIdRef = useRef(peerUserId);
  useEffect(() => {
    peerUserIdRef.current = peerUserId;
  }, [peerUserId]);

  const callStateRef = useRef(callState);
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  // Helper to check if a call node is stale or expired
  // (Bypassed for diagnostic test as requested by user)
  const isCallStale = (callData) => {
    if (!callData) return true;
    console.log('[CALL] [isCallStale] Diagnostic check (stale rejection temporarily disabled):', callData);
    return false;
  };

  // Helper to detach all active candidate listeners
  const cleanupCandidateListeners = useCallback(() => {
    console.log('[SIGNALING] Detaching candidate listeners. Count:', listenersRef.current.length);
    listenersRef.current.forEach((unsubscribe) => {
      try {
        if (typeof unsubscribe === 'function') unsubscribe();
      } catch (err) {
        console.error('[SIGNALING] Error unsubscribing candidate listener:', err);
      }
    });
    listenersRef.current = [];
  }, []);

  // Helper to stop all local media tracks
  const stopLocalTracks = useCallback(() => {
    if (localStreamRef.current) {
      console.log('[WEBRTC] Stopping local stream media tracks');
      localStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (err) {
          console.error('[WEBRTC] Error stopping track:', err);
        }
      });
      localStreamRef.current = null;
      setLocalStream(null);
    }
  }, []);

  // Helper to clear ICE timeout timer
  const clearIceTimeout = useCallback(() => {
    if (iceTimeoutRef.current) {
      console.log('[ICE] Clearing ICE connection timeout timer');
      clearTimeout(iceTimeoutRef.current);
      iceTimeoutRef.current = null;
    }
  }, []);

  // Complete cleanup function
  const endCallSession = useCallback(
    async (reason = 'ended', userMessage = null) => {
      console.log(`[CALL] Ending call session. Reason: ${reason}, Message: ${userMessage}`);
      clearIceTimeout();
      cleanupCandidateListeners();

      if (pcRef.current) {
        try {
          pcRef.current.onicecandidate = null;
          pcRef.current.ontrack = null;
          pcRef.current.oniceconnectionstatechange = null;
          pcRef.current.close();
          console.log('[WEBRTC] Closed RTCPeerConnection');
        } catch (err) {
          console.error('[WEBRTC] Error closing RTCPeerConnection:', err);
        }
        pcRef.current = null;
      }

      stopLocalTracks();
      setRemoteStream(null);
      processedCandidatesRef.current.clear();
      iceCandidatesQueueRef.current = [];
      currentOfferRef.current = null;
      activeCallIdRef.current = null;

      if (reason === 'declined') {
        setCallState('declined');
        setErrorMessage('Call was declined.');
      } else if (reason === 'failed') {
        setCallState('failed');
        setErrorMessage(userMessage || 'P2P connection failed. Returning to chat.');
      } else if (reason === 'permission_denied') {
        setCallState('permission_denied');
        setErrorMessage(userMessage || 'Camera/Microphone permission was denied.');
      } else {
        setCallState('ended');
      }

      if (chatRoomId) {
        console.log('[SIGNALING] Removing temporary call node for roomId:', chatRoomId);
        await cleanupCall(chatRoomId);
      }

      setTimeout(() => {
        setCallState('idle');
        setCallType(null);
        setRole(null);
        setCallerId(null);
        setCalleeId(null);
        setIsMicMuted(false);
        setIsCameraOff(false);
        setErrorMessage(null);
      }, 3000);
    },
    [chatRoomId, cleanupCandidateListeners, stopLocalTracks, clearIceTimeout]
  );

  // Request browser media permissions and create local stream
  const acquireMedia = useCallback(
    async (type) => {
      console.log(`[WEBRTC] Requesting getUserMedia permissions for type: ${type}`);
      try {
        const constraints = {
          audio: true,
          video: type === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('[WEBRTC] getUserMedia granted successfully. Tracks count:', stream.getTracks().length);
        localStreamRef.current = stream;
        setLocalStream(stream);
        return stream;
      } catch (err) {
        console.error('[WEBRTC] Media permission denied or error:', err);
        endCallSession('permission_denied', 'Microphone or camera access is required.');
        return null;
      }
    },
    [endCallSession]
  );

  // Create and configure RTCPeerConnection
  const createPeerConnection = useCallback(
    (myRole, roomId) => {
      console.log(`[WEBRTC] Creating RTCPeerConnection for role: ${myRole}, roomId: ${roomId}`);
      if (pcRef.current) {
        try {
          pcRef.current.close();
        } catch (e) {}
      }

      const pc = new RTCPeerConnection(rtcConfig);
      pcRef.current = pc;

      // Handle remote tracks
      pc.ontrack = (event) => {
        console.log('[WEBRTC] pc.ontrack event received! Track:', event.track.kind, 'Streams:', event.streams.length);
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        } else if (event.track) {
          setRemoteStream(new MediaStream([event.track]));
        }
      };

      // Send ICE candidates to role-specific sub-path
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`[ICE] Local candidate created for role: ${myRole}`);
          sendIceCandidate(roomId, event.candidate, myRole);
          console.log(`[ICE] Candidate written to path: candidates/${myRole}`);
        }
      };

      // Monitor ICE connection state
      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;
        console.log(`[ICE] iceConnectionState: ${state}, signalingState: ${pc.signalingState}`);

        if (state === 'checking') {
          setCallState('connecting');
          clearIceTimeout();
          iceTimeoutRef.current = setTimeout(() => {
            if (pcRef.current && (pcRef.current.iceConnectionState === 'checking' || pcRef.current.iceConnectionState === 'disconnected')) {
              console.warn('[ICE] ICE connection timed out after 15s in checking state');
              endCallSession('failed', 'Direct P2P connection timed out.');
            }
          }, 15000);
        } else if (state === 'connected' || state === 'completed') {
          clearIceTimeout();
          console.log('[ICE] ICE connection successfully connected/completed!');
          setCallState('connected');
        } else if (state === 'failed') {
          clearIceTimeout();
          console.error('[ICE] ICE connection failed!');
          endCallSession('failed', 'P2P connection failed. Reconnecting or returning to chat.');
        } else if (state === 'disconnected') {
          console.log('[ICE] ICE connection disconnected, waiting for reconnection...');
          setCallState('connecting');
        }
      };

      // Add local tracks to peer connection
      if (localStreamRef.current) {
        console.log('[WEBRTC] Adding local stream tracks to RTCPeerConnection');
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      return pc;
    },
    [clearIceTimeout, endCallSession]
  );

  // Start outgoing call (Caller side)
  const startCall = useCallback(
    async (type) => {
      if (!chatRoomId || !userId) return;

      const targetPeerId = peerUserId || peerUserIdRef.current || 'peer';
      console.log(`[Caller] startCall START. roomId: ${chatRoomId}, userId: ${userId}, peerUserId: ${targetPeerId}, type: ${type}`);

      setCallState('calling');
      setCallType(type);
      setRole('caller');
      setCallerId(userId);

      const stream = await acquireMedia(type);
      if (!stream) return;

      const pc = createPeerConnection('caller', chatRoomId);

      try {
        console.log('[Caller] createOffer START');
        const offer = await pc.createOffer();
        console.log('[Caller] createOffer SUCCESS');

        console.log('[Caller] setLocalDescription START');
        await pc.setLocalDescription(offer);
        console.log('[Caller] setLocalDescription SUCCESS');

        console.log('[SIGNALING] Caller writing offer to Firebase START');
        const generatedCallId = await initiateCall(chatRoomId, {
          callerId: userId,
          calleeId: targetPeerId,
          type,
          offer,
        });
        activeCallIdRef.current = generatedCallId;
        console.log(`[SIGNALING] Caller writing offer SUCCESS with callId: ${generatedCallId}`);
      } catch (err) {
        console.error('[Caller] EXACT FAILURE in startCall:', err);
        console.error('[Caller] Error name:', err?.name);
        console.error('[Caller] Error message:', err?.message);
        console.error('[Caller] Error stack:', err?.stack);
        endCallSession('failed', 'Could not start call.');
        return;
      }

      // Listen to remote ICE candidates from callee
      console.log('[SIGNALING] Attaching listener for callee ICE candidates');
      const unsubscribeCandidates = listenToIceCandidates(chatRoomId, 'callee', async (candidate) => {
        const candidateKey = JSON.stringify(candidate);
        if (!processedCandidatesRef.current.has(candidateKey) && pcRef.current) {
          processedCandidatesRef.current.add(candidateKey);
          console.log('[ICE] Remote candidate received on caller');
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('[ICE] Remote candidate added SUCCESS on caller');
          } catch (e) {
            console.error('[ICE] Error adding callee candidate:', e);
          }
        }
      });
      listenersRef.current.push(unsubscribeCandidates);
    },
    [chatRoomId, userId, peerUserId, acquireMedia, createPeerConnection, endCallSession]
  );

  // Accept incoming call (Callee side)
  const acceptCall = useCallback(
    async (overrideOffer = null, overrideType = null) => {
      // Sanitize input: only use overrideOffer if it is a valid SDP offer object (not SyntheticEvent)
      const validOffer = overrideOffer && overrideOffer.type && overrideOffer.sdp ? overrideOffer : currentOfferRef.current;
      const validCallType = typeof overrideType === 'string' ? overrideType : callType;

      console.log('[Callee] acceptCall START', {
        roomId: chatRoomId,
        validCallType,
        hasValidOffer: !!validOffer,
      });

      if (!chatRoomId || !validOffer || !validCallType) {
        console.error('[Callee] acceptCall missing parameters:', {
          chatRoomId,
          hasValidOffer: !!validOffer,
          validCallType,
        });
        return;
      }

      setCallState('connecting');
      setRole('callee');

      const stream = await acquireMedia(validCallType);
      if (!stream) return;

      const pc = createPeerConnection('callee', chatRoomId);

      try {
        console.log('[Callee] setRemoteDescription START');
        await pc.setRemoteDescription(new RTCSessionDescription(validOffer));
        console.log('[Callee] setRemoteDescription SUCCESS');

        while (iceCandidatesQueueRef.current.length > 0) {
          const cand = iceCandidatesQueueRef.current.shift();
          console.log('[ICE] Remote candidate added (from queue) on callee');
          await pc.addIceCandidate(new RTCIceCandidate(cand));
        }

        console.log('[Callee] createAnswer START');
        const answer = await pc.createAnswer();
        console.log('[Callee] createAnswer SUCCESS');

        console.log('[Callee] setLocalDescription START');
        await pc.setLocalDescription(answer);
        console.log('[Callee] setLocalDescription SUCCESS');

        console.log('[SIGNALING] Callee writing answer to Firebase START');
        await answerCall(chatRoomId, answer);
        console.log('[SIGNALING] Callee writing answer to Firebase SUCCESS');
      } catch (err) {
        console.error('[Callee] EXACT FAILURE in acceptCall:', err);
        console.error('[Callee] Error name:', err?.name);
        console.error('[Callee] Error message:', err?.message);
        console.error('[Callee] Error stack:', err?.stack);
        endCallSession('failed', 'Could not establish connection.');
        return;
      }

      // Listen to remote ICE candidates from caller
      console.log('[SIGNALING] Attaching listener for caller ICE candidates');
      const unsubscribeCandidates = listenToIceCandidates(chatRoomId, 'caller', async (candidate) => {
        const candidateKey = JSON.stringify(candidate);
        if (!processedCandidatesRef.current.has(candidateKey)) {
          processedCandidatesRef.current.add(candidateKey);
          console.log('[ICE] Remote candidate received on callee');
          try {
            if (pcRef.current && pcRef.current.remoteDescription) {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
              console.log('[ICE] Remote candidate added SUCCESS on callee');
            } else {
              console.log('[ICE] Remote candidate queued on callee');
              iceCandidatesQueueRef.current.push(candidate);
            }
          } catch (e) {
            console.error('[ICE] Error adding caller candidate:', e);
          }
        }
      });
      listenersRef.current.push(unsubscribeCandidates);
    },
    [chatRoomId, callType, acquireMedia, createPeerConnection, endCallSession]
  );

  // Maintain refs for callback functions to keep useEffect listener stable
  const acceptCallRef = useRef(acceptCall);
  useEffect(() => {
    acceptCallRef.current = acceptCall;
  }, [acceptCall]);

  const endCallSessionRef = useRef(endCallSession);
  useEffect(() => {
    endCallSessionRef.current = endCallSession;
  }, [endCallSession]);

  // Reject incoming call (Callee side)
  const declineIncomingCall = useCallback(async () => {
    console.log('[CALL] Callee declining call');
    if (chatRoomId) {
      await declineCall(chatRoomId);
    }
    endCallSession('idle');
  }, [chatRoomId, endCallSession]);

  // User presses Hang Up
  const hangUp = useCallback(async () => {
    console.log('[CALL] User pressed Hang Up');
    endCallSession('ended');
  }, [endCallSession]);

  // Mic mute toggle
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
        console.log('[WEBRTC] Toggled microphone:', audioTrack.enabled);
      }
    }
  };

  // Camera toggle
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
        console.log('[WEBRTC] Toggled camera:', videoTrack.enabled);
      }
    }
  };

  // Persistent main listener for Firebase call state updates under chatRooms/{chatRoomId}/call
  useEffect(() => {
    if (!chatRoomId || !userId) return;

    console.log('[SIGNALING] Attaching main listenToCallState listener for roomId:', chatRoomId, 'userId:', userId);

    const unsubscribeCall = listenToCallState(chatRoomId, async (callData) => {
      console.log('[SIGNALING] listenToCallState snapshot received:', callData);

      if (!callData) {
        console.log('[SIGNALING] Call node is empty/null');
        if (callStateRef.current !== 'idle' && callStateRef.current !== 'ended' && callStateRef.current !== 'declined') {
          endCallSessionRef.current('ended');
        }
        return;
      }

      if (isCallStale(callData)) {
        console.log('[SIGNALING] isCallStale returned true for callData:', callData);
        if (callStateRef.current !== 'idle' && callStateRef.current !== 'ended' && callStateRef.current !== 'declined') {
          endCallSessionRef.current('ended');
        }
        return;
      }

      const { callId, status, type, callerId: cId, offer, answer } = callData;
      console.log(`[SIGNALING] Evaluated callData -> callId: ${callId}, status: ${status}, type: ${type}, callerId: ${cId}`);

      if (status === 'declined') {
        console.log('[SIGNALING] Call status is declined');
        endCallSessionRef.current('declined');
        return;
      }

      if (status === 'ended') {
        console.log('[SIGNALING] Call status is ended');
        endCallSessionRef.current('ended');
        return;
      }

      // Incoming call received when idle
      if (status === 'calling' && cId !== userId && callStateRef.current === 'idle') {
        console.log('[CALL] Incoming call detected on callee side!');
        activeCallIdRef.current = callId;
        setCallType(type);
        setCallerId(cId);
        setCalleeId(userId);
        setRole('callee');
        currentOfferRef.current = offer;

        const isPreMatchCall = roomMatchTypeRef.current === 'audio' || roomMatchTypeRef.current === 'video';
        console.log(`[CALL] Callee processing call. isPreMatchCall: ${isPreMatchCall}, roomMatchType: ${roomMatchTypeRef.current}`);

        if (isPreMatchCall) {
          console.log('[CALL] Pre-match selection -> automatically accepting call');
          acceptCallRef.current(offer, type);
        } else {
          console.log('[CALL] Mid-chat call -> prompting IncomingCallModal');
          setCallState('incoming');
        }
      }

      // Caller receiving answer from callee
      if (status === 'connected' && cId === userId && answer && pcRef.current && !pcRef.current.currentRemoteDescription) {
        console.log('[Caller] Received SDP answer from callee! Setting remote description START...');
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          console.log('[Caller] setRemoteDescription SUCCESS from answer!');
        } catch (e) {
          console.error('[Caller] Error setting remote description from answer:', e);
        }
      }
    });

    return () => {
      console.log('[SIGNALING] Detaching main listenToCallState listener for roomId:', chatRoomId);
      unsubscribeCall();
    };
  }, [chatRoomId, userId]);

  // Handle Automatic Matchmaking Call setup
  useEffect(() => {
    if (!chatRoomId || !userId || !roomMatchType) return;
    if (roomMatchType !== 'audio' && roomMatchType !== 'video') return;

    if (peerUserId) {
      const sorted = [userId, peerUserId].sort();
      const isDesignatedCaller = sorted[0] === userId;
      console.log(`[CALL] Auto-call check. roomMatchType: ${roomMatchType}, isDesignatedCaller: ${isDesignatedCaller}, callState: ${callState}`);

      if (isDesignatedCaller && callState === 'idle') {
        console.log('[CALL] Designated caller initiating auto-match call!');
        startCall(roomMatchType);
      }
    }
  }, [chatRoomId, userId, peerUserId, roomMatchType, callState, startCall]);

  // Clean up on unmount or chatRoomId change
  useEffect(() => {
    return () => {
      console.log('[WEBRTC] Component unmounting or chatRoomId changed. Cleaning up call session.');
      endCallSession('ended');
    };
  }, [chatRoomId, endCallSession]);

  return {
    callState,
    callType,
    role,
    localStream,
    remoteStream,
    isMicMuted,
    isCameraOff,
    errorMessage,
    startCall,
    acceptCall,
    declineIncomingCall,
    hangUp,
    toggleMic,
    toggleCamera,
  };
};
