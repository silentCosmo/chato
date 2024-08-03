import { ref, set, get, runTransaction, serverTimestamp, update } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed
import cleanUpInactiveChatRooms from './cleanUpInactiveChatRooms';

export const createChatRoom = async (user1Id, user2Id, sharedInterests) => {
  // Sort user IDs to create a unique chat room ID
  //const sortedUserIds = [user1Id, user2Id].sort();
  // Remove 'user_' prefix from the user IDs
  const cleanUser1Id = user1Id.replace('user_', '');
  const cleanUser2Id = user2Id.replace('user_', '');

  // Sort user IDs to create a unique and consistent chat room ID
  const sortedUserIds = [cleanUser1Id, cleanUser2Id].sort();
  const chatRoomId = `${sortedUserIds[0]}RM${sortedUserIds[1]}`;

  const chatRoomRef = ref(database, `chatRooms/${chatRoomId}`);

  // Use a transaction to safely check and create the chat room
  try {
    await runTransaction(chatRoomRef, (currentData) => {
      if (currentData === null) {
        return {
          participants: {
            [user1Id]: true,
            [user2Id]: true,
          },
          matchedInterests: sharedInterests,
          messages: [],
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
        };
      }
      // If currentData is not null, the chat room already exists
      return; // Abort the transaction
    });

    // Update user status if the chat room creation was successful
    await update(chatRoomRef, { matchedInterests: sharedInterests });
    await update(ref(database, `users/${user1Id}`), { isBusy: true, matchedUserId: user2Id, chatRoomId });
    await update(ref(database, `users/${user2Id}`), { isBusy: true, matchedUserId: user1Id, chatRoomId });
    //await cleanUpInactiveChatRooms();

    return chatRoomId;

  } catch (error) {
    console.error('Error creating or fetching chat room:', error);
    throw new Error('Failed to create or fetch chat room.');
  }
};


/* import { ref, set, push, update, get, serverTimestamp } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed

export const createChatRoom = async (user1Id, user2Id) => {
  const user1Ref = ref(database, 'users/' + user1Id);
  const user2Ref = ref(database, 'users/' + user2Id);

  // Fetch user data
  const [user1Snapshot, user2Snapshot] = await Promise.all([get(user1Ref), get(user2Ref)]);
  const user1Data = user1Snapshot.val();
  const user2Data = user2Snapshot.val();

  // Check if both users already have the same chat room
  if (user1Data.chatRoomId && user1Data?.chatRoomId === user2Data?.chatRoomId) {
    return user1Data.chatRoomId;
  }

  // Otherwise, create a new chat room
  const chatRoomsRef = ref(database, 'chatRooms');
  const newChatRoomRef = push(chatRoomsRef);
  const chatRoomId = newChatRoomRef.key;

  const initialChatRoomData = {
    participants: {
      [user1Id]: true,
      [user2Id]: true,
    },
    messages: [],
    createdAt: serverTimestamp(),
  };

  // Set the new chat room data
  await set(newChatRoomRef, initialChatRoomData);

  console.log('roomDone');
  // Update users with the new chatRoomId
  await Promise.all([
    update(user1Ref, { isBusy: true, matchedUserId: user2Id, chatRoomId }),
    update(user2Ref, { isBusy: true, matchedUserId: user1Id, chatRoomId }),
  ]);


  return chatRoomId;
}; */




/* import { ref, set, push, update, serverTimestamp } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed

export const createChatRoom = async (user1Id, user2Id) => {
  const chatRoomsRef = ref(database, 'chatRooms');
  const newChatRoomRef = push(chatRoomsRef);
  const chatRoomId = newChatRoomRef.key;

  const initialChatRoomData = {
    participants: {
      [user1Id]: true,
      [user2Id]: true,
    },
    messages: [],
    createdAt: serverTimestamp(),
  };

  await set(newChatRoomRef, initialChatRoomData);

  await update(ref(database, 'users/' + user1Id), { isBusy: true, matchedUserId: user2Id, chatRoomId });
  await update(ref(database, 'users/' + user2Id), { isBusy: true, matchedUserId: user1Id, chatRoomId });

  return chatRoomId;
};
 */