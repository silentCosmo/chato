import { ref, set, update, remove, push, onValue, off } from 'firebase/database';
import { database } from '@/firebase/config';

/**
 * Initiates a WebRTC call by writing signaling info under chatRooms/{chatRoomId}/call.
 */
export const initiateCall = async (chatRoomId, { callerId, calleeId, type, offer }) => {
  const callRef = ref(database, `chatRooms/${chatRoomId}/call`);
  const callId = `call_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const callData = {
    callId,
    status: 'calling', // 'calling' | 'connected' | 'declined' | 'ended' | 'failed'
    type, // 'audio' | 'video'
    callerId,
    calleeId,
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
    createdAt: Date.now(),
  };
  await set(callRef, callData);
  return callId;
};

/**
 * Callee answers the incoming call by providing an SDP answer.
 */
export const answerCall = async (chatRoomId, answer) => {
  const callRef = ref(database, `chatRooms/${chatRoomId}/call`);
  await update(callRef, {
    status: 'connected',
    answer: {
      type: answer.type,
      sdp: answer.sdp,
    },
  });
};

/**
 * Declines an incoming call.
 */
export const declineCall = async (chatRoomId) => {
  const statusRef = ref(database, `chatRooms/${chatRoomId}/call/status`);
  await set(statusRef, 'declined');
};

/**
 * Updates call status in database.
 */
export const updateCallStatus = async (chatRoomId, status) => {
  const statusRef = ref(database, `chatRooms/${chatRoomId}/call/status`);
  await set(statusRef, status);
};

/**
 * Cleans up temporary call signaling data (chatRooms/{chatRoomId}/call).
 * Never deletes messages, participants, or the room itself.
 */
export const cleanupCall = async (chatRoomId) => {
  if (!chatRoomId) return;
  const callRef = ref(database, `chatRooms/${chatRoomId}/call`);
  try {
    await remove(callRef);
  } catch (err) {
    console.error('Error removing call signaling data:', err);
  }
};

/**
 * Sends an ICE candidate to the specified role path: 'caller' or 'callee'.
 */
export const sendIceCandidate = async (chatRoomId, candidate, role) => {
  if (!chatRoomId || !candidate || !role) return;
  const candidateRef = push(ref(database, `chatRooms/${chatRoomId}/call/candidates/${role}`));
  await set(candidateRef, candidate.toJSON ? candidate.toJSON() : candidate);
};

/**
 * Listens to main call signaling state changes under chatRooms/{chatRoomId}/call.
 * Returns an unsubscribe cleanup function.
 */
export const listenToCallState = (chatRoomId, callback) => {
  if (!chatRoomId) return () => {};
  const callRef = ref(database, `chatRooms/${chatRoomId}/call`);
  
  const handleSnapshot = (snapshot) => {
    callback(snapshot.val());
  };

  onValue(callRef, handleSnapshot);

  return () => {
    off(callRef, 'value', handleSnapshot);
  };
};

/**
 * Listens to remote ICE candidates under chatRooms/{chatRoomId}/call/candidates/{targetRole}.
 * Returns an unsubscribe cleanup function.
 */
export const listenToIceCandidates = (chatRoomId, targetRole, callback) => {
  if (!chatRoomId || !targetRole) return () => {};
  const candidatesRef = ref(database, `chatRooms/${chatRoomId}/call/candidates/${targetRole}`);

  const handleSnapshot = (snapshot) => {
    const val = snapshot.val();
    if (val) {
      Object.values(val).forEach((candidate) => {
        callback(candidate);
      });
    }
  };

  onValue(candidatesRef, handleSnapshot);

  return () => {
    off(candidatesRef, 'value', handleSnapshot);
  };
};
