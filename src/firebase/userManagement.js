import { ref, set, update, remove, serverTimestamp } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed

export const createUser = async (userId) => {
  try {
    await set(ref(database, 'users/' + userId), {
      userId,
      interests: [],
      isActive: true,
      lastActive: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user.');
  }
};

export const updateUserActivity = async (userId) => {
  try {
    await update(ref(database, 'users/' + userId), {
      lastActive: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user activity:', error);
    throw new Error('Error updating user activity.');
  }
};

export const removeUser = async (userId) => {
  try {
    await remove(ref(database, 'users/' + userId));
  } catch (error) {
    console.error('Error removing user:', error);
    throw new Error('Error removing user.');
  }
};

export const startHeartbeat = (userId) => {
  const interval = setInterval(() => {
    updateUserActivity(userId);
  }, 5000);

  const handleBeforeUnload = () => {
    removeUser(userId);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    clearInterval(interval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    removeUser(userId);
  };
};
