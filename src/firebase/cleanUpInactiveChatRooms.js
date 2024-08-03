import { ref, remove, get } from 'firebase/database';
import { database } from '../firebase/config'; // Adjust import as needed

const INACTIVE_THRESHOLD = 30 * 60 * 1000; // 30 minutes in milliseconds

const cleanUpInactiveChatRooms = async () => {
  const chatRoomsRef = ref(database, 'chatRooms');
  
  try {
    console.log('Fetching chat rooms for cleanup...');
    const snapshot = await get(chatRoomsRef);
    if (!snapshot.exists()) {
      console.log('No chat rooms found.');
      return;
    }

    const data = snapshot.val();
    const currentTime = new Date().getTime();
    console.log('Fetched chat room data:', data);

    const promises = Object.entries(data).map(async ([chatRoomId, chatRoom]) => {
      const lastActivityTime = chatRoom.lastActive ? new Date(chatRoom.lastActive).getTime() : 0;
      console.log(currentTime , lastActivityTime , INACTIVE_THRESHOLD);
      if (currentTime - lastActivityTime > INACTIVE_THRESHOLD) {
        
        // Chat room is considered inactive
        try {
          await remove(ref(database, `chatRooms/${chatRoomId}`));
          console.log(`Removed inactive chat room with ID: ${chatRoomId}`);
        } catch (removeError) {
          console.error(`Error removing chat room with ID: ${chatRoomId}`, removeError);
        }
      }
    });

    await Promise.all(promises);
    console.log('Chat room cleanup completed.');
  } catch (error) {
    console.error('Error fetching chat rooms for cleanup: ', error);
  }
};

export default cleanUpInactiveChatRooms;
