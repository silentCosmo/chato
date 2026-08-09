'use client';
import React from 'react';

const IncomingCallModal = ({ callType, onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 text-center animate-zoom">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-3xl animate-bounce">
          {callType === 'video' ? '📹' : '📞'}
        </div>

        <h3 className="text-xl font-bold mb-1">
          Incoming {callType === 'video' ? 'Video' : 'Audio'} Call
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Anonymous Stranger wants to connect with you.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onDecline && onDecline()}
            className="flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-all duration-200 shadow-md active:scale-95"
          >
            Decline
          </button>
          <button
            onClick={() => onAccept && onAccept()}
            className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all duration-200 shadow-md active:scale-95 animate-pulse"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
