'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { fetchActiveUsersCount } from '@/firebase/activeUsers';
import { startPresence } from '@/firebase/presence';

const PresenceContext = createContext({
  activeUserCount: 0,
  userId: null,
  authLoaded: false,
});

export const PresenceProvider = ({ children }) => {
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  // 1. Manage Authentication lifecycle
  useEffect(() => {
    let unsubscribeCount = null;
    let unsubscribeAuth = null;

    if (typeof window !== 'undefined') {
      // Listen to auth state transitions
      unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('Authenticated anonymously with UID:', user.uid);
          setUserId(user.uid);
          setAuthLoaded(true);
        } else {
          // Trigger sign-in if not currently authenticated
          signInAnonymously(auth).catch((error) => {
            console.error('Firebase Anonymous Auth failed:', error);
          });
        }
      });

      // Setup the single presence counting listener
      unsubscribeCount = fetchActiveUsersCount(setActiveUserCount);
    }

    return () => {
      if (unsubscribeCount) unsubscribeCount();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // 2. Manage global session presence lifecycle
  useEffect(() => {
    if (!authLoaded || !userId) return;

    console.log('Starting global presence tracking for UID:', userId);
    const stopPresence = startPresence(userId);

    return () => {
      console.log('Stopping global presence tracking for UID:', userId);
      stopPresence();
    };
  }, [userId, authLoaded]);

  return (
    <PresenceContext.Provider value={{ activeUserCount, userId, authLoaded }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => useContext(PresenceContext);
export const usePresenceCount = () => {
  const { activeUserCount } = useContext(PresenceContext);
  return activeUserCount;
};
