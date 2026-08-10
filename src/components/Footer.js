import React from 'react';

const Footer = () => {
  return (
    <footer
      className="
        bg-gray-200
        dark:bg-slate-950
        border-t
        border-gray-300
        dark:border-slate-800
        text-slate-500
        dark:text-slate-400
        text-center
        py-7
        px-4
      "
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text">
          Helbeku
        </div>

        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-500">
          Meet someone new. Start a conversation.
        </p>

        <div className="flex justify-center items-center gap-3 sm:gap-5 mt-4 text-xs">
          <a
            href="/privacy"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Privacy
          </a>

          <span className="text-slate-400 dark:text-slate-700">•</span>

          <a
            href="/guidelines"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Guidelines
          </a>

          <span className="text-slate-400 dark:text-slate-700">•</span>

          <a
            href="/terms"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Terms
          </a>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-300 dark:border-slate-800">
          <p className="text-[11px] text-slate-400 dark:text-slate-600">
            © 2024 Helbeku. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;