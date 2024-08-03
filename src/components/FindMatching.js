import {
  ref,
  set,
  onValue,
  serverTimestamp,
  update,
  remove,
  get,
} from "firebase/database";
import { database } from "../firebase/config"; // Adjust import as needed
import { createChatRoom } from "@/firebase/createChatRoom";
import cleanUpInactiveUsers from "@/firebase/cleanupInactiveUsers";

export const findMatching = (
  storedUserId,
  userInterests,
  setMatches,
  setLoading,
  setError,
  setChatRoomId
) => {
  const userRef = ref(database, "users/" + storedUserId);
  const usersRef = ref(database, "users");
  let unsubscribe = null;
  let chatRoomCreated = false; // Track if the chat room has been created

  // Clean up inactive users
  cleanUpInactiveUsers()
    .then(() => {
      // Save the user's interests and active status to Firebase
      update(userRef, {
        userId: storedUserId,
        interests: userInterests,
        isActive: true,
        isBusy: false,
        matchedUserId: null,
        lastActive: serverTimestamp(),
      })
        .then(() => {
          // Find matches
          unsubscribe = onValue(
            usersRef,
            (snapshot) => {
              const data = snapshot.val();
              const matchedUsers = [];

              if (data) {
                Object.values(data).forEach((user) => {
                  const currentTime = new Date().getTime();
                  const lastActiveTime = user.lastActive? new Date(user.lastActive).getTime(): 0;
                  const isActiveRecently =
                    currentTime - lastActiveTime <= 10000;

                  if (
                    user.userId !== storedUserId &&
                    user.isActive && user.isActive &&
                    (!user.isBusy || user.matchedUserId === storedUserId)
                  ) {
                    const matchedInterests = user.interests?.filter(
                      (interest) => userInterests.includes(interest)
                    );
                    if (matchedInterests?.length > 0) {
                      matchedUsers.push({
                        ...user,
                        matchedInterests,
                        matchedPoints: matchedInterests.length,
                      });
                    }
                  }
                });
              }

              setMatches(matchedUsers);
              setLoading(false);

              if (matchedUsers.length > 0 && !chatRoomCreated) {
                chatRoomCreated = true; // Prevent further room creation
                console.log("MatchDone");
                console.log("got", matchedUsers[0].userId);

                // Find the maximum number of shared interests
                const maxSharedInterests = Math.max(
                  ...matchedUsers.map((user) => user.matchedPoints)
                );

                // Filter users with the maximum shared interests
                const bestMatches = matchedUsers.filter(
                  (user) => user.matchedPoints === maxSharedInterests
                );

                // Randomly select one user from the best matches
                const selectedMatch =
                  bestMatches[Math.floor(Math.random() * bestMatches.length)];

                const sharedInterests = selectedMatch.matchedInterests;

                // Create chat room and set chat room ID
                createChatRoom(
                  storedUserId,
                  selectedMatch.userId,
                  sharedInterests
                )
                  .then((chatRoomId) => setChatRoomId(chatRoomId))
                  .catch((error) => setError("Error creating chat room."));

                // Stop listening for further matches
                if (unsubscribe) {
                  unsubscribe();
                }
              }
            },
            (error) => {
              console.error("Error fetching data: ", error);
              setError("Error fetching data.");
              setLoading(false);
            }
          );
        })
        .catch((error) => {
          console.error("Error saving data to Firebase: ", error);
          setError("Error saving data.");
          setLoading(false);
        });
    })
    .catch((error) => {
      console.error("Error cleaning up inactive users: ", error);
      setError("Error cleaning up inactive users.");
      setLoading(false);
    });

  // Clean up function to unsubscribe and remove user data on component unmount
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
    remove(userRef);
  };
};

/* import { ref, set, onValue, serverTimestamp, update, remove } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed
import { createChatRoom } from '@/firebase/createChatRoom';

const INACTIVE_THRESHOLD = 30000; // 30 seconds

export const findMatching = (storedUserId, userInterests, setMatches, setLoading, setError, setChatRoomId) => {
  const userRef = ref(database, 'users/' + storedUserId);
  const usersRef = ref(database, 'users');
  let unsubscribe = null;
  let chatRoomCreated = false; // Track if the chat room has been created
  let activityInterval = null;

  
  update(userRef, {
    userId: storedUserId,
    interests: userInterests,
    isActive: true,
    isBusy: false,
    matchedUserId: null,
    lastActive: serverTimestamp(),
  })
    .then(() => {
      // Update the lastActive timestamp periodically
      activityInterval = setInterval(() => {
        update(userRef, { lastActive: serverTimestamp() });
      }, 10000); // Update every 10 seconds (adjust as needed)

      // Find matches
      unsubscribe = onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const matchedUsers = [];

        if (data) {
          Object.values(data).forEach((user) => {
            const currentTime = new Date().getTime();
            const lastActiveTime = user.lastActive ? new Date(user.lastActive).getTime() : 0;
            const isActiveRecently = currentTime - lastActiveTime <= INACTIVE_THRESHOLD;

            if (
              user.userId !== storedUserId &&
              user.isActive &&
              isActiveRecently &&
              (!user.isBusy || user.matchedUserId === storedUserId)
            ) {
              const matchedInterests = user.interests?.filter(interest => userInterests.includes(interest));
              if (matchedInterests?.length > 0) {
                matchedUsers.push({
                  ...user,
                  matchedInterests,
                  matchedPoints: matchedInterests.length,
                });
              }
            }
          });
        }

        setMatches(matchedUsers);
        setLoading(false);

        if (matchedUsers.length > 0 && !chatRoomCreated) {
          chatRoomCreated = true; // Prevent further room creation
          console.log('MatchDone');
          console.log('got', matchedUsers[0].userId);

          // Find the maximum number of shared interests
          const maxSharedInterests = Math.max(...matchedUsers.map(user => user.matchedPoints));
          
          // Filter users with the maximum shared interests
          const bestMatches = matchedUsers.filter(user => user.matchedPoints === maxSharedInterests);
          
          // Randomly select one user from the best matches
          const selectedMatch = bestMatches[Math.floor(Math.random() * bestMatches.length)];

          const sharedInterests = selectedMatch.matchedInterests;

          // Create chat room and set chat room ID
          createChatRoom(storedUserId, selectedMatch.userId, sharedInterests)
            .then((chatRoomId) => setChatRoomId(chatRoomId))
            .catch((error) => setError('Error creating chat room.'));

          // Stop listening for further matches
          if (unsubscribe) {
            unsubscribe();
          }

          // Clear the activity interval
          clearInterval(activityInterval);
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

  // Clean up function to unsubscribe and remove user data on component unmount
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
    if (activityInterval) {
      clearInterval(activityInterval);
    }
    remove(userRef);
  };
}; */

/* import { ref, set, onValue, serverTimestamp, update, remove } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed
import { createChatRoom } from '@/firebase/createChatRoom';

export const findMatching = (storedUserId, userInterests, setMatches, setLoading, setError, setChatRoomId) => {
  const userRef = ref(database, 'users/' + storedUserId);
  const usersRef = ref(database, 'users');
  let unsubscribe = null;
  let chatRoomCreated = false; // Track if the chat room has been created

  // Save the user's interests and active status to Firebase
  update(userRef, {
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
            if (
              user.userId !== storedUserId &&
              user.isActive &&
              (!user.isBusy || user.matchedUserId === storedUserId)
            ) {
              const matchedInterests = user.interests?.filter(interest => userInterests.includes(interest));
              if (matchedInterests?.length > 0) {
                matchedUsers.push({
                  ...user,
                  matchedInterests,
                  matchedPoints: matchedInterests.length,
                });
              }
            }
          });
        }

        setMatches(matchedUsers);
        setLoading(false);

        if (matchedUsers.length > 0 && !chatRoomCreated) {
          chatRoomCreated = true; // Prevent further room creation
          console.log('MatchDone');
          console.log('got', matchedUsers[0].userId);

          // Find the maximum number of shared interests
          const maxSharedInterests = Math.max(...matchedUsers.map(user => user.matchedPoints));
          
          // Filter users with the maximum shared interests
          const bestMatches = matchedUsers.filter(user => user.matchedPoints === maxSharedInterests);
          
          // Randomly select one user from the best matches
          const selectedMatch = bestMatches[Math.floor(Math.random() * bestMatches.length)];

          const sharedInterests = selectedMatch.matchedInterests;
          

          // Create chat room and set chat room ID
          createChatRoom(storedUserId, selectedMatch.userId, sharedInterests)
            .then((chatRoomId) => setChatRoomId(chatRoomId))
            .catch((error) => setError('Error creating chat room.'));

          // Stop listening for further matches
          if (unsubscribe) {
            unsubscribe();
          }
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

  // Clean up function to unsubscribe and remove user data on component unmount
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
    remove(userRef);
  };
}; */
