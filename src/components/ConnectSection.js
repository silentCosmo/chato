'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserCreation from '@/firebase/createUser';

const ConnectSection = () => {
  const [interests, setInterests] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedInterests = JSON.parse(localStorage.getItem('userInterests')) || [];
    setInterests(storedInterests);
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

  const handleConnect = () => {
    router.push(`/chat`);
  };

  return (
    <section className="flex md:text-base text-sm flex-col items-center justify-center min-h-screen text-center py-20 md:px-0 px-2 bg-gray-50 dark:bg-slate-900">
      <UserCreation/>
      <h1 className="md:text-5xl text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 bg-clip-text mb-4">Connect with People</h1>
      <p className="md:text-xl text-sm text-gray-700 dark:text-gray-400 mb-6">Type your interests and select connection.</p>
      <div className="flex flex-col items-center space-y-4">
        {interests.length > 0 && (
          <div className="flex flex-col items-center -mt-4 -mb-3">
            <div className="flex flex-wrap justify-center space-x-2">
              {interests.map((interest, index) => (
                <span key={index} className="bg-blue-200 dark:bg-blue-800 dark:bg-opacity-40 text-blue-800 dark:text-blue-300 px-3 mb-2 py-1 rounded-lg">
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
        />
        <div className="flex space-x-4 mt-4">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300">
            Text
          </button>
          <button className="bg-slate-500 opacity-50 text-white px-6 py-3 rounded-md cursor-not-allowed">Video (Coming Soon)</button>
        </div>
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 mt-4"
          onClick={handleConnect}
        >
          Connect
        </button>
      </div>
    </section>
  );
};

export default ConnectSection;
