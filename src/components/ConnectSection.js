'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ConnectSection = () => {
  const [interests, setInterests] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [matchType, setMatchType] = useState('text');
  const router = useRouter();

  useEffect(() => {
    const storedInterests = JSON.parse(localStorage.getItem('userInterests')) || [];
    setInterests(storedInterests);
    const storedType = localStorage.getItem('matchType') || 'text';
    setMatchType(storedType);
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      addInterest(inputValue);
      setInputValue('');
    }
  };

  const addInterest = (interest) => {
    if (interests.length < 5) {
      setInterests([...interests, interest]);
      localStorage.setItem('userInterests', JSON.stringify([...interests, interest]));
    }
  };

  const clearInterests = () => {
    setInterests([]);
    localStorage.removeItem('userInterests');
  };

  const handleSelectMode = (mode) => {
    setMatchType(mode);
    localStorage.setItem('matchType', mode);
  };

  const handleConnect = () => {
    if (inputValue.trim() !== '') {
      addInterest(inputValue);
      setInputValue('');
    }
    localStorage.setItem('matchType', matchType);
    router.push(`/chat`);
  };

  return (
    <section className="flex md:text-base text-sm flex-col items-center justify-center min-h-screen text-center py-20 md:px-0 px-2 bg-gray-50 dark:bg-slate-900">
      <h1 className="md:text-5xl text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 bg-clip-text mb-4">Connect with People</h1>
      <p className="md:text-xl text-sm text-gray-700 dark:text-gray-400 mb-6">Type your interests and select connection mode.</p>
      <div className="flex flex-col items-center space-y-4">
        {interests.length > 0 && (
          <div className="flex flex-col items-center -mt-4 -mb-3">
            <div className="flex flex-wrap justify-center space-x-2">
              {interests.map((interest, index) => (
                <span key={index} className="bg-blue-200 dark:bg-blue-800 dark:bg-opacity-40 text-blue-800 dark:text-blue-300 px-3 mb-2 py-1 pb-2 rounded-lg">
                  {interest}
                </span>
              ))}
              <button
                className="bg-rose-500 text-gray-100 px-3 mb-2 rounded-lg bg-opacity-80 dark:bg-opacity-60 hover:bg-rose-500 transition-colors duration-300"
                onClick={clearInterests}
              >
                Clear
              </button>
            </div>
          </div>
        )}
        <input
          type="text"
          placeholder="Enter your interests..."
          className="w-80 p-3 dark:placeholder-slate-500 dark:bg-slate-700 dark:text-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={25}
        />
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => handleSelectMode('text')}
            className={`px-5 py-2.5 rounded-md transition-all duration-300 font-medium ${
              matchType === 'text'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            💬 Text
          </button>
          <button
            onClick={() => handleSelectMode('audio')}
            className={`px-5 py-2.5 rounded-md transition-all duration-300 font-medium ${
              matchType === 'audio'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            📞 Audio
          </button>
          <button
            onClick={() => handleSelectMode('video')}
            className={`px-5 py-2.5 rounded-md transition-all duration-300 font-medium ${
              matchType === 'video'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            📹 Video
          </button>
        </div>
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 mt-4 font-semibold shadow-md"
          onClick={handleConnect}
        >
          Connect
        </button>
      </div>
    </section>
  );
};

export default ConnectSection;
