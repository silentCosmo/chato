import { ref, onValue } from 'firebase/database';
import { database } from './config';

export const fetchActiveUsersCount = (setActiveUserCount) => {
  const usersRef = ref(database, 'users');
  
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const activeCount = data
      ? Object.values(data).filter(user => user.isActive).length
      : 0;
    setActiveUserCount(activeCount);
  }, (error) => {
    console.error('Error fetching active users: ', error);
    setActiveUserCount(1); // Handle error case
  });
};