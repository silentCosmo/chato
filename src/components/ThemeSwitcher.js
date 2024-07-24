'use client'
import React, { useState, useEffect } from 'react';

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
      className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md focus:outline-none"
    >
      <span className="text-gray-800 dark:text-gray-200">
        {darkMode ? '🌞' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeSwitcher;
