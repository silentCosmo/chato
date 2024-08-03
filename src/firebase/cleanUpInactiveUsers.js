import { ref, remove, get } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed

const INACTIVE_THRESHOLD = 30 * 60 * 1000; // 30 minutes in milliseconds

const cleanUpInactiveUsers = async () => {
  const usersRef = ref(database, 'users');
  
  try {
    console.log('Fetching users for cleanup...');
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) {
      console.log('No users found.');
      return;
    }

    const data = snapshot.val();
    const currentTime = new Date().getTime();
    console.log('Fetched data:', data);

    const promises = Object.entries(data).map(async ([userId, user]) => {
      const lastActiveTime = user.lastActive ? new Date(user.lastActive).getTime() : 0;
      if (currentTime - lastActiveTime > INACTIVE_THRESHOLD) {
        // User is considered inactive
        try {
          await remove(ref(database, `users/${userId}`));
          console.log(`Removed inactive user with ID: ${userId}`);
        } catch (removeError) {
          console.error(`Error removing user with ID: ${userId}`, removeError);
        }
      }
    });

    await Promise.all(promises);
    console.log('Cleanup completed.');
  } catch (error) {
    console.error('Error fetching users for cleanup: ', error);
  }
};

export default cleanUpInactiveUsers;
