import { ref, remove } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed

export const removeUser = async (userId) => {
  try {
    await remove(ref(database, 'presence/' + userId));
  } catch (error) {
    console.error('Error removing user:', error);
    throw new Error('Error removing user.');
  }
};
