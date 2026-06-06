import { ref, onValue, onDisconnect, serverTimestamp, set } from 'firebase/database';
import { database } from './config';
import { removeUser } from './userManagement';

/**
 * Initializes native presence tracking for a user.
 * Automatically handles tab close, network loss, and crashes via onDisconnect.
 * 
 * @param {string} userId - The unique ID of the user.
 * @returns {function} Cleanup function to unsubscribe and remove presence node.
 */
export const startPresence = (userId) => {
  const connectedRef = ref(database, '.info/connected');
  const userPresenceRef = ref(database, `presence/${userId}`);

  const unsubscribe = onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === true) {
      // 1. Register onDisconnect hook to automatically delete the node when connection drops
      onDisconnect(userPresenceRef)
        .remove()
        .catch((err) => console.error('Error setting onDisconnect presence:', err));

      // Retrieve interests from localStorage (if any) to keep compatibility with client-side matchmaking
      let interests = [];
      if (typeof window !== 'undefined') {
        try {
          interests = JSON.parse(localStorage.getItem('userInterests')) || [];
        } catch (e) {
          console.error('Error parsing userInterests:', e);
        }
      }

      // 2. Mark the user profile as active/online
      set(userPresenceRef, {
        userId,
        interests,
        isActive: true,
        isBusy: false,
        matchedUserId: null,
        lastActive: serverTimestamp(),
      }).catch((err) => console.error('Error setting initial presence:', err));
    }
  });

  // Return a cleanup function for React useEffect unmounts
  return () => {
    unsubscribe();
    removeUser(userId).catch((err) => console.error('Error removing user presence on cleanup:', err));
  };
};
