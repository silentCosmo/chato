  'use client';
  import React, { useState, useEffect } from 'react';
  import { AiFillSun } from "react-icons/ai";
  import { FaMoon } from 'react-icons/fa'; // Import icons for moon and sun

  const ThemeSwitcher = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
      // Check and apply the saved theme preference on component mount
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
    }, []);

    const toggleTheme = () => {
      const newTheme = darkMode ? 'light' : 'dark';
      setDarkMode(!darkMode);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', !darkMode);
    };

    return (
      <button
        onClick={toggleTheme}
        className="relative w-12 h-6 bg-blue-200 dark:bg-blue-950 rounded-lg flex items-center cursor-pointer focus:outline-none"
      >
        <div
          className={`absolute w-6 h-6 bg-blue-500 dark:bg-blue-900 rounded-lg shadow-md transform transition-transform duration-500 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}
          style={{ left: '0' }}
        />
        <span
          className={`absolute left-1 text-gray-200 transition-opacity duration-500 ease-in-out ${darkMode ? 'opacity-0' : 'opacity-100'}`}
        >
          <AiFillSun />
        </span>
        <span
          className={`absolute right-1 text-gray-400 transition-opacity duration-500 ease-in-out ${darkMode ? 'opacity-100' : 'opacity-0'}`}
        >
          <FaMoon />
        </span>
      </button>
    );
  };

  export default ThemeSwitcher;
