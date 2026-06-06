'use client';
import React, { useEffect } from 'react';
import { usePresence } from '@/context/PresenceContext';
import { startPresence } from './presence';

const UserCreation = () => {
  const { userId, authLoaded } = usePresence();
  
  useEffect(() => {
    if (!authLoaded || !userId) return;

    console.log('Initializing presence session for UID:', userId);
    const stopPresence = startPresence(userId);

    return () => {
      console.log('Cleaning up presence session for UID:', userId);
      stopPresence();
    };
  }, [userId, authLoaded]);

  return null; // This component does not render anything visible
};

export default UserCreation;
