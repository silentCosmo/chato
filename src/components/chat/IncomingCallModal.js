'use client';

import React from 'react';
import {
  PhoneIcon,
  VideoCameraIcon,
  PhoneXMarkIcon,
} from '@heroicons/react/24/solid';

const IncomingCallModal = ({ callType, onAccept, onDecline }) => {
  const isVideo = callType === 'video';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-slate-950/45 dark:bg-black/60 backdrop-blur-md" />

      {/* Call Card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-white/95 dark:bg-slate-900/95 shadow-2xl shadow-black/20 dark:shadow-black/50 backdrop-blur-2xl animate-fade-in">

        {/* Very subtle top accent */}
        <div
          className={`h-1 w-full ${isVideo
            ? 'bg-blue-500/80'
            : 'bg-emerald-500/80'
            }`}
        />

        <div className="px-6 py-7 sm:px-8 sm:py-8">

          {/* Caller identity */}
          <div className="flex flex-col items-center text-center">

            {/* Avatar */}
            <div className="relative mb-5">
              <div
                className={`absolute animate-pulse inset-0 rounded-full blur-xl opacity-20 ${isVideo ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}
              />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                {isVideo ? (
                  <VideoCameraIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                ) : (
                  <PhoneIcon className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                )}
              </div>

              {/* Online indicator */}
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-emerald-500 dark:border-slate-900" />
            </div>

            <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text">
              Helbeku
            </h3>

            <span className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Incoming {isVideo ? 'Video' : 'Voice'} Call
            </span>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-center gap-4">

            {/* Decline */}
            <button
              type="button"
              onClick={() => onDecline && onDecline()}
              className="group flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-500 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              title="Decline call"
              aria-label="Decline call"
            >
              <PhoneXMarkIcon className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
            </button>

            {/* Accept */}
            <button
              type="button"
              onClick={() => onAccept && onAccept()}
              className={`group flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 active:scale-95 ${isVideo
                ? 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-700'
                : 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700'
                }`}
              title="Accept call"
              aria-label="Accept call"
            >
              {isVideo ? (
                <VideoCameraIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              ) : (
                <PhoneIcon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              )}
            </button>
          </div>

          {/* Tiny helper text */}
          <p className="mt-5 text-center text-[11px] text-slate-400 dark:text-slate-500">
            You can decline and continue chatting
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
