import { ref, onValue } from 'firebase/database';
import { database } from './config';

export const fetchActiveUsersCount = (setActiveUserCount) => {
  const usersRef = ref(database, 'presence');
  
  return onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const activeCount = data
      ? Object.keys(data).length
      : 0;
    setActiveUserCount(activeCount);
  }, (error) => {
    console.error('Error fetching active users: ', error);
    setActiveUserCount(1); // Handle error case
  });
};