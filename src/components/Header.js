'use client'; // Add this line to mark the component as a client component

import React, { useEffect, useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { fetchActiveUsersCount } from '../firebase/activeUsers';
import { FaUsers } from 'react-icons/fa'; // Import an icon from react-icons for the active users

const Header = () => {
  const [activeUserCount, setActiveUserCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchActiveUsersCount(setActiveUserCount);
    }
  }, []);

  return (
    <header className="bg-gray-50 fixed top-0 z-50 w-full dark:bg-slate-900 shadow-md py-4 px-6 flex justify-between items-center">
      <div className="md:text-4xl text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text">
        Helbeku
      </div>
      <nav className="space-x-4">
        {/* Uncomment and customize navigation links as needed */}
        {/* <a href="#about" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600">About</a>
        <a href="#faq" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600">FAQ</a> */}
      </nav>
      <div className="flex items-center space-x-3">
        <ThemeSwitcher />
        <div className="flex items-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-[0.350rem] rounded-lg shadow-md">
          <FaUsers className="text-base" /> {/* User icon */}
          {/* <span className="font-semibold text-xs">Active Users:</span> */}
          <span className="ml-2 text-xs font-bold">{activeUserCount}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
