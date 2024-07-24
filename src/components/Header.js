import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  return (
    <header className="bg-gray-50 sticky top-0 z-50 dark:bg-slate-900 shadow- py-4 px-6 flex justify-between items-center">
      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text">Helbeku</div>
      <nav className="space-x-4">
        <a href="#about" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600">About</a>
        <a href="#faq" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600">FAQ</a>
      </nav>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
