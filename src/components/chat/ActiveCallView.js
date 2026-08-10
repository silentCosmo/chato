'use client';
import React, { useEffect, useRef } from 'react';
import {
  MicrophoneIcon,
  VideoCameraIcon,
  PhoneXMarkIcon,
  UserIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/solid';

const ActiveCallView = ({
  callState,
  callType,
  localStream,
  remoteStream,
  isMicMuted,
  isCameraOff,
  errorMessage,
  onToggleMic,
  onToggleCamera,
  onHangUp,
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Assign local stream to local video element
  useEffect(() => {
    if (localVideoRef.current) {
      if (localStream) {
        localVideoRef.current.srcObject = localStream;
      } else {
        localVideoRef.current.srcObject = null;
      }
    }
  }, [localStream, callType, isCameraOff]);

  // Assign remote stream to remote video element
  useEffect(() => {
    if (remoteVideoRef.current) {
      if (remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      } else {
        remoteVideoRef.current.srcObject = null;
      }
    }
  }, [remoteStream, callType]);

  const isVideo = callType === 'video';

  // Compact Audio Call Bar
  if (!isVideo) {
    return (
      <div className="w-full bg-slate-900/95 text-slate-100 px-4 py-3 border-b border-slate-800 shadow-md flex items-center justify-between gap-3 shrink-0 animate-fade-in">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100 truncate">
                Anonymous Stranger
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                🎧 Voice Call
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {callState === 'connected'
                ? 'Voice connected'
                : callState === 'connecting'
                ? 'Connecting audio...'
                : 'Calling...'}
            </span>
          </div>
        </div>

        {/* Compact Voice Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleMic}
            className={`p-2 rounded-xl text-white transition-all duration-150 active:scale-95 flex items-center gap-1.5 text-xs font-semibold ${
              isMicMuted
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            <MicrophoneIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{isMicMuted ? 'Muted' : 'Mute'}</span>
          </button>

          <button
            type="button"
            onClick={onHangUp}
            className="p-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all duration-150 active:scale-95"
            title="End Call"
          >
            <PhoneXMarkIcon className="w-4 h-4" />
            <span>End</span>
          </button>
        </div>
      </div>
    );
  }

  // Dominant Video Call Viewport & Attached Full-Width Control Bar
  return (
    <div className="flex flex-col w-full shrink-0 border-b border-slate-800 shadow-xl transition-all duration-200">
      {/* 1. Immersive Video Stage */}
      <div className="relative w-full h-[45vh] md:h-[55vh] bg-slate-950 text-slate-100 overflow-hidden">
        {/* Top Video Status Badge Overlay */}
        <div className="absolute top-3 left-4 z-30 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs font-semibold text-slate-200 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {callState === 'connected'
              ? 'Live Video Connected'
              : callState === 'connecting'
              ? 'Connecting video stream...'
              : 'Calling...'}
          </span>
        </div>

        {/* Error Alert Overlay */}
        {errorMessage && (
          <div className="absolute top-12 inset-x-4 z-40 max-w-sm mx-auto bg-rose-600/90 backdrop-blur-md text-white text-center py-2 px-4 rounded-xl text-xs font-medium shadow-2xl animate-bounce flex items-center justify-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-white" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Remote Video Stream */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            remoteStream && remoteStream.getVideoTracks().length > 0
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        />

        {/* Remote Video Placeholder */}
        {(!remoteStream || remoteStream.getVideoTracks().length === 0) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-400 p-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl shadow-xl">
                <UserIcon className="w-10 h-10 text-slate-400" />
              </div>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-200">
              Anonymous Stranger
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {callState === 'connected'
                ? 'Waiting for stranger to enable camera...'
                : 'Establishing video stream...'}
            </p>
          </div>
        )}

        {/* Local Video Thumbnail (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 z-20 w-28 sm:w-40 aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl transition-all duration-200">
          {!isCameraOff && localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-1 text-center">
              <VideoCameraIcon className="w-6 h-6 text-rose-500/80 mb-1" />
              <span className="text-[10px] font-semibold">Camera Off</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. DEDICATED FULL-WIDTH VIDEO CONTROL BAR (Immediately below video stage) */}
      <div className="w-full bg-slate-900 text-slate-100 py-2.5 px-4 sm:px-6 border-b border-slate-800 flex items-center justify-between shadow-md shrink-0">
        {/* Left Slot: Future Controls / Status Slot */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline truncate">
            Stranger Video Session
          </span>
        </div>

        {/* Center Slot: Main Video Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mute Microphone Toggle */}
          <button
            type="button"
            onClick={onToggleMic}
            className={`p-2.5 sm:p-3 rounded-full text-white font-medium transition-all duration-150 active:scale-95 shadow-sm ${
              isMicMuted
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            aria-label={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>

          {/* Toggle Camera Button */}
          <button
            type="button"
            onClick={onToggleCamera}
            className={`p-2.5 sm:p-3 rounded-full text-white font-medium transition-all duration-150 active:scale-95 shadow-sm ${
              isCameraOff
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
            aria-label={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            <VideoCameraIcon className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={onHangUp}
            className="p-3 sm:p-3 rounded-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium shadow-lg shadow-rose-600/30 transition-all duration-150 active:scale-95"
            title="End Call"
            aria-label="End Call"
          >
            <PhoneXMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Right Slot: Future Controls Slot (Architectural expansion slot) */}
        <div className="flex items-center justify-end gap-2 min-w-0 flex-1">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors duration-150 hidden sm:flex items-center justify-center opacity-60 hover:opacity-100"
            title="Call Options (Future)"
            disabled
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCallView;
