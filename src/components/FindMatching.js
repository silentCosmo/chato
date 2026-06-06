import { ref, onValue, onDisconnect } from "firebase/database";
import { database } from "../firebase/config"; // Adjust import as needed

/**
 * Initiates matchmaking by calling the server-side API and listening to the user's private match node.
 * 
 * @param {string} storedUserId - Unique ID of the searching user
 * @param {Array<string>} userInterests - Array of selected interests
 * @param {function} setMatches - Set state for matching indicators (optional fallback)
 * @param {function} setLoading - Hook to toggle loader spinner
 * @param {function} setError - Hook to set error message
 * @param {function} setChatRoomId - Hook to assign successful chat room ID
 * @returns {function} Cleanup function to run when the finder unmounts
 */
export const findMatching = (
  storedUserId,
  userInterests,
  setMatches,
  setLoading,
  setError,
  setChatRoomId
) => {
  const matchRef = ref(database, `matches/${storedUserId}`);
  const queueRef = ref(database, `queue/${storedUserId}`);
  let unsubscribeMatch = null;

  // Enforce server-side cleanup if the client drops connection abruptly
  onDisconnect(queueRef).remove().catch((err) => console.error("onDisconnect queue error:", err));
  onDisconnect(matchRef).remove().catch((err) => console.error("onDisconnect match error:", err));

  // 1. Subscribe to the private match notification node
  unsubscribeMatch = onValue(matchRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.chatRoomId) {
      console.log("Matched successfully server-side! Room ID:", data.chatRoomId);
      setChatRoomId(data.chatRoomId);
    }
  });

  // 2. Submit matchmaking request to serverless Route Handler
  fetch('/api/match/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: storedUserId,
      interests: userInterests
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      if (data.status === 'matched') {
        console.log("Immediate match success! Room ID:", data.chatRoomId);
        setChatRoomId(data.chatRoomId);
      } else {
        console.log("Successfully entered match queue. Waiting...");
        setLoading(true); // Keep loading status active
      }
    } else {
      console.error("Matchmaker join rejected:", data.message);
      setError(data.message || "Matchmaking request failed");
      setLoading(false);
    }
  })
  .catch(err => {
    console.error("Network error requesting match:", err);
    setError("Network connection issue. Matchmaking could not be requested.");
    setLoading(false);
  });

  // Return cleanup hook to execute when leaving MatchFinder component
  return () => {
    if (unsubscribeMatch) {
      unsubscribeMatch();
    }
    
    // Notify server to remove us from matching queue
    fetch('/api/match/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: storedUserId })
    }).catch(err => console.error("Failed to notify leave queue:", err));
  };
};
