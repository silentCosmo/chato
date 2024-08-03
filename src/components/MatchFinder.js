'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { findMatching, findRandom } from './FindMatching';
import Header from './Header';
import ChatRoom from './ChatRoom';

const MatchFinder = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reTry, setRetry] = useState(true);
  const [chatRoomId, setChatRoomId] = useState(null);
  const router = useRouter();

  const [userInterests, setUserInterests] = useState(() => {
    if (typeof window !== "undefined") {
      // Retrieve and parse the data from localStorage
      const storedInterests = localStorage.getItem('userInterests');
      if (storedInterests) {
        try {
          return JSON.parse(storedInterests);
        } catch (error) {
          console.error("Error parsing userInterests from localStorage:", error);
          return ['random']; // Fallback default value in case of error
        }
      }
    }
    return ['random']; // Fallback default value if window is undefined
  });



  useEffect(() => {
    
    //const userInterests = JSON.parse(localStorage.getItem('userInterests')) || [];

    if (userInterests.length > 0) {
      const userId = `user_${Date.now()}`;
      if (!sessionStorage.getItem('userId')) {
        sessionStorage.setItem('userId', userId);
      }

      const storedUserId = sessionStorage.getItem('userId');

      const cleanup = findMatching(storedUserId, userInterests, setMatches, setLoading, setError, setChatRoomId);

      return () => {
        cleanup && cleanup();
      };
    } else {
      setLoading(false);
    }
  }, [reTry]);

  useEffect(() => {
    if (chatRoomId) {
      //router.push(`/chat/${chatRoomId}`);
    }
  }, [chatRoomId, router]);

  useEffect(() => {
    if (!loading && reTry && matches.length === 0) {
      setShowConfirmation(true);
    } else if (matches.length > 0) {
      setShowConfirmation(false);
    }
  }, [loading, matches, reTry]);

  const handleSkip = () => {
    setChatRoomId(null)
    setUserInterests(JSON.parse(localStorage.getItem('userInterests')) || ['random'])
  };

  if (chatRoomId) {
    // Render the chat room if a chatRoomId is present
    return <ChatRoom chatRoomId={chatRoomId} userId={sessionStorage.getItem('userId')} onSkip={handleSkip} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-50 dark:bg-slate-900">
      <Header />
      {loading ? (
        <p className="text-lg text-blue-600">Loading...</p>
      ) : error ? (
        <p className="text-lg text-red-600">{error}</p>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 bg-clip-text mb-8">
            Find Your Matches
          </h1>
          <div className="w-full max-w-4xl mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 dark:text-gray-200">Your Matches:</h2>
            {matches.length > 0 ? (
              <ul className="space-y-4">
                {matches.map((match, index) => (
                  <li key={index} className="bg-blue-100 dark:bg-slate-800 text-blue-800 dark:text-gray-300 px-6 py-4 rounded-lg shadow-lg">
                    <div className="font-semibold text-lg">
                      User ID: <span className="text-blue-600">{match.userId}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Matched Interests:</span> {match.matchedInterests?.length > 0 ? match.matchedInterests.join(', ') : 'None'}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-400">No matches found.</p>
            )}
          </div>

          {showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">No matches found</h2>
                <p className="mb-4">Do you want to find a random match?</p>
                <div className="flex space-x-4 justify-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                    onClick={() => {
                      setShowConfirmation(false);
                      setUserInterests(['random']);
                      setRetry(false);
                      //handleRandomMatch();
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
                    onClick={() => {
                      setShowConfirmation(false);
                      setRetry(false);
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MatchFinder;
