'use client';
import React, { useEffect, useRef } from 'react';

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

  // Bind local stream to local video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch((err) => console.log('Local video play error:', err));
    }
  }, [localStream]);

  // Bind remote stream to remote video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((err) => console.log('Remote video play error:', err));
    }
  }, [remoteStream]);

  const renderStatusBadge = () => {
    switch (callState) {
      case 'calling':
        return <span className="bg-amber-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">Calling...</span>;
      case 'connecting':
        return <span className="bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">Connecting...</span>;
      case 'connected':
        return <span className="bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold">Connected</span>;
      case 'declined':
        return <span className="bg-rose-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold">Call Declined</span>;
      case 'failed':
        return <span className="bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold">Connection Failed</span>;
      case 'permission_denied':
        return <span className="bg-rose-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold">Permission Denied</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl sm:max-w-3xl mx-auto my-2 px-2 animate-fade-in">
      {/* Omegle / OmeTV Centered Call Stage */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-slate-950 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
        
        {/* Top Header Overlay Bar */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-md">
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              {callType === 'video' ? '📹 Video Call' : '📞 Audio Call'}
            </span>
            <span className="text-slate-400 text-xs">• Anonymous Stranger</span>
            {renderStatusBadge()}
          </div>
        </div>

        {/* Error / Failure Banner Overlay */}
        {errorMessage && (
          <div className="absolute inset-x-4 top-14 z-40 bg-rose-600/90 backdrop-blur-md text-white text-center py-2 px-4 rounded-xl text-xs sm:text-sm font-medium shadow-xl animate-bounce">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Main Content Stage Area */}
        <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
          {callType === 'video' ? (
            <>
              {/* Remote Video Stream */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  remoteStream && remoteStream.getVideoTracks().length > 0 ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Remote Video Loading / Placeholder State */}
              {(!remoteStream || remoteStream.getVideoTracks().length === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 text-slate-400 p-4">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-slate-800/80 flex items-center justify-center text-4xl sm:text-5xl mb-3 border border-slate-700 shadow-inner animate-pulse">
                    👤
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-200">Anonymous Stranger</p>
                  <p className="text-xs text-slate-400 mt-1">Waiting for remote camera stream...</p>
                </div>
              )}

              {/* Local Video Thumbnail (PiP) */}
              <div className="absolute bottom-4 right-4 z-20 w-24 sm:w-36 aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
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
                    <span className="text-xl sm:text-2xl">📷❌</span>
                    <span className="text-[10px] mt-1 font-medium">Camera Off</span>
                  </div>
                )}
              </div>
            </>
          ) : callType === 'audio' ? (
            /* Audio-Only Communication Stage */
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 p-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-4xl sm:text-6xl shadow-2xl border-4 border-white/10 animate-pulse">
                  🎙️
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs">
                  ✓
                </div>
              </div>
              <h4 className="mt-4 text-base sm:text-lg font-bold tracking-wide">Anonymous Stranger</h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Audio call in progress</p>
            </div>
          ) : (
            /* Neutral Connecting Stage */
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-300 p-6">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl animate-pulse mb-3 border border-slate-700">
                📞
              </div>
              <p className="text-sm font-semibold">Connecting call...</p>
            </div>
          )}
        </div>

        {/* Floating Control Toolbar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3 sm:space-x-5 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/15 shadow-2xl">
          {/* Mute Microphone Button */}
          <button
            onClick={onToggleMic}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all duration-200 active:scale-90 ${
              isMicMuted
                ? 'bg-rose-600 text-white shadow-lg scale-105'
                : 'bg-slate-800/80 hover:bg-slate-700 text-white border border-white/10'
            }`}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMicMuted ? '🎙️❌' : '🎙️'}
          </button>

          {/* Toggle Camera Button (Video Mode Only) */}
          {callType === 'video' && (
            <button
              onClick={onToggleCamera}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all duration-200 active:scale-90 ${
                isCameraOff
                  ? 'bg-rose-600 text-white shadow-lg scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-white border border-white/10'
              }`}
              title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isCameraOff ? '📹❌' : '📹'}
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={onHangUp}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-lg sm:text-xl transition-all duration-200 shadow-xl active:scale-90"
            title="End Call"
          >
            🔴
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCallView;
