import { ref, set, onValue, serverTimestamp, update, remove } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed

export const findMatching = (storedUserId, userInterests, setMatches, setLoading, setError) => {
  const userRef = ref(database, 'users/' + storedUserId);
  const usersRef = ref(database, 'users');
  let unsubscribe = null;

  // Save the user's interests and active status to Firebase
  set(userRef, {
    userId: storedUserId,
    interests: userInterests,
    isActive: true,
    isBusy: false,
    matchedUserId: null,
    lastActive: serverTimestamp(),
  })
    .then(() => {
      // Find matches
      unsubscribe = onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const matchedUsers = [];
        if (data) {
          Object.values(data).forEach((user) => {
            if (user.userId !== storedUserId && user.isActive && !user.isBusy ||user.matchedUserId==storedUserId) {
              const matchedInterests = user.interests?.filter(interest => userInterests.includes(interest));
              if (matchedInterests?.length > 0) {
                update(userRef, { isBusy: true, matchedUserId: user.userId });
                //update(ref(database, 'users/' + user.userId), { isBusy: true, matchedUserId: storedUserId });
                matchedUsers.push({
                  ...user,
                  matchedInterests,
                });
              }
            }
          });
        }

        setMatches(matchedUsers);
        setLoading(false);

        // If matches are found, stop the listener
        if (matchedUsers.length > 0 && unsubscribe) {
            console.log('MatchDone');
          unsubscribe();
        }
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
  /* const heartbeatInterval = setInterval(() => {
    update(userRef, {
      lastActive: serverTimestamp(),
    });
  }, 5000);*/

  /* const handleBeforeUnload = () => {
    //update(userRef,{matchedUserId:null})
    //remove(userRef);
  };  */

  //window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
    //clearInterval(heartbeatInterval);
    //window.removeEventListener('beforeunload', handleBeforeUnload);
    remove(userRef);
  };
};

export const findRandom = (storedUserId, setMatches, setLoading, setError) => {
    const userRef = ref(database, 'users/' + storedUserId);
    const usersRef = ref(database, 'users');
    let unsubscribe = null;
    let timeoutId = null;
  
    unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const activeUsers = [];
  
      if (data) {
        Object.values(data).forEach((user) => {
          if (user.userId !== storedUserId && user.isActive && !user.isBusy || user.matchedUserId==storedUserId) {
            activeUsers.push(user);
          }
        });
  
        const randomIndex = Math.floor(Math.random() * activeUsers.length);
        const randomUser = activeUsers[randomIndex] || null;
  
        if (randomUser) {
          update(userRef, { isBusy: true, matchedUserId: randomUser.userId });
          //update(ref(database, 'users/' + randomUser.userId), { isBusy: true, matchedUserId: storedUserId });
          setMatches([randomUser]);
        } else {
          setMatches([]);
        }
  
        setLoading(false);
  
        // If a match is found, stop the listener and clear the timeout
        if (randomUser && unsubscribe) {
            console.log('randomDone');
          clearTimeout(timeoutId);
          unsubscribe();
        }
      } else {
        setMatches([]);
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching data: ', error);
      setError('Error fetching data.');
      setLoading(false);
    });
  
    // Stop the random match after 10 seconds and inform the user
    timeoutId = setTimeout(() => {
      if (unsubscribe) {
        unsubscribe();
      }
      setLoading(false);
      setError('Everyone is busy, please try again later.');
    }, 10000);
  
    // Heartbeat mechanism to update user's last active timestamp
    /* const heartbeatInterval = setInterval(() => {
      update(userRef, {
        lastActive: serverTimestamp(),
      });
    }, 5000); */
  
    const handleBeforeUnload = () => {
      remove(userRef);
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearTimeout(timeoutId);
      //clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      remove(userRef);
    };
  };
  