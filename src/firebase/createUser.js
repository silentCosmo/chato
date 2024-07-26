'use client';
import React, { useEffect } from 'react';
import { createUser, startHeartbeat } from '../firebase/userManagement'; // Import user management functions

const UserCreation = () => {
    // Create a unique user ID and store it in sessionStorage
const createOrGetUserId = () => {
    let userId = sessionStorage.getItem('userId');
    if (!userId) {
      userId = `user_${Date.now()}`;
      sessionStorage.setItem('userId', userId);
    }
    return userId;
  };
  
  useEffect(() => {
    const userId = createOrGetUserId(); // Function to create or retrieve user ID
    console.log('User ID from sessionStorage:', userId);

    createUser(userId)
      .then(() => {
        console.log('User data saved to Firebase:', userId);
        return startHeartbeat(userId); // Start heartbeat
      })
      .catch((error) => {
        console.error('Error initializing user:', error);
      });

    return () => {
      // Cleanup logic if needed
    };
  }, []);

  return null; // This component does not render anything visible
};

export default UserCreation;
