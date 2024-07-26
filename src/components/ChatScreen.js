'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { findMatching } from './FindMatching'; // Adjust import as needed
import Header from './Header';

const ChatScreen = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const interestsParam = searchParams.get('interests');
    const userInterests = interestsParam ? interestsParam.split(',') : null;

    if (userInterests) {
      const userId = `user_${Date.now()}`;
      if (!sessionStorage.getItem('userId')) {
        sessionStorage.setItem('userId', userId);
      }

      const storedUserId = sessionStorage.getItem('userId');

      const cleanup = findMatching(storedUserId, userInterests, setMatches, setLoading, setError);

      return cleanup;
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  if (loading) return <p className="text-lg text-blue-600">Loading...</p>;
  if (error) return <p className="text-lg text-red-600">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-50 dark:bg-slate-900">
      <Header/>
      <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 bg-clip-text mb-8">
        Find Your Matches
      </h1>
      <div className="w-full max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-gray-200">Your Matches:</h2>
        {matches.length > 0 ? (
          <ul className="space-y-4">
            {matches.map((match, index) => (
              <li key={index} className="bg-blue-100 dark:bg-slate-800 text-blue-800 dark:text-gray-300 px-6 py-4 rounded-lg shadow-lg">
                <div className="font-semibold text-lg">User ID: <span className="text-blue-600">{match.userId}</span></div>
                <div className="mt-2">
                  <span className="font-medium">Matched Interests:</span> {match.matchedInterests.length > 0 ? match.matchedInterests.join(', ') : 'None'}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400">No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
