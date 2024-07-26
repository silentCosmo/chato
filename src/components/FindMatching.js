import { ref, set, onValue, serverTimestamp, update, remove } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed

export const findMatching = (storedUserId, userInterests, setMatches, setLoading, setError) => {
  // Save the user's interests and active status to Firebase
  set(ref(database, 'users/' + storedUserId), {
    userId: storedUserId,
    interests: userInterests,
    isActive: true,
    lastActive: serverTimestamp(),
  })
  .then(() => {
    // Find matches
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const matchedUsers = [];
      if (data) {
        Object.values(data).forEach((user) => {
          if (user.userId !== storedUserId && user.isActive) {
            const matchedInterests = user.interests?.filter(interest => userInterests.includes(interest));
            if (matchedInterests?.length > 0) {
              matchedUsers.push({
                ...user,
                matchedInterests
              });
            }
          }
        });
      }
      setMatches(matchedUsers);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching data: ', error);
      setError('Error fetching data.');
      setLoading(false);
    });
  })
  .catch((error) => {
    console.error('Error saving data to Firebase: ', error);
    setError('Error saving data.');
    setLoading(false);
  });

  // Heartbeat mechanism to update user's last active timestamp
  const heartbeatInterval = setInterval(() => {
    update(ref(database, 'users/' + storedUserId), {
      lastActive: serverTimestamp(),
    });
  }, 5000);

  const handleBeforeUnload = () => {
    remove(ref(database, 'users/' + storedUserId));
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    clearInterval(heartbeatInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    remove(ref(database, 'users/' + storedUserId));
  };
};