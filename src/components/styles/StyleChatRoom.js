"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  ref,
  onValue,
  push,
  set,
  update,
  remove,
  serverTimestamp,
} from "firebase/database";
import { database } from "../../firebase/config"; // Adjust import as needed
import Header from "../Header";

// Custom hook to handle unload confirmation and cleanup
const useUnloadConfirmation = (shouldConfirm, callback) => {
  /* useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (shouldConfirm) {
        event.preventDefault();
        event.returnValue = ""; // For modern browsers
        callback(); // Call the cleanup function
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldConfirm, callback]); */
};
const StyleChatRoom = ({ chatRoomId, onSkip }) => {
  const userId = "user1";
  const [interests, setInterests] = useState(["ok", "Dokie"]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Function to delete the chat room
  const deleteChatRoom = () => {
    if (chatRoomId) {
      const chatRoomRef = ref(database, `chatRooms/${chatRoomId}`);
      remove(chatRoomRef)
        .then(() => console.log(`Chat room ${chatRoomId} deleted.`))
        .catch((error) => console.error("Error deleting chat room:", error));
    }
  };

  useUnloadConfirmation(true, deleteChatRoom); // Enable confirmation on unload and delete the chat room

  useEffect(() => {
    // Temporarily disable Firebase subscription for styling
    // if (!chatRoomId) return;

    // const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
    // const unsubscribe = onValue(messagesRef, (snapshot) => {
    //   const data = snapshot.val();
    //   const loadedMessages = data ? Object.values(data) : [];
    //   setMessages(loadedMessages);
    // });

    // Mock messages for styling
    const mockMessages = [
      { senderId: "user1", text: "Hello!", timestamp: new Date().getTime() },
      { senderId: "user2", text: "Hi there!", timestamp: new Date().getTime() },
      {
        senderId: "user1",
        text: "How are you?",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user2",
        text: "I'm good, thanks! You?",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user2",
        text: "The Unix epoch (or Unix time or POSIX time or Unix timestamp) is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), not counting leap seconds (in ISO 8601: 1970-01-01T00:00:00Z). Literally speaking the epoch is Unix time 0 (midnight 1/1/1970), but 'epoch' is often used as a synonym for Unix time. Some systems store epoch dates as a signed 32-bit integer, which might cause problems on January 19, 2038 (known as the Year 2038 problem or Y2038). The converter on this page converts timestamps in seconds (10-digit), milliseconds (13-digit) and microseconds (16-digit) to readable dates.",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user1",
        text: "dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200dark:text-gray-200",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user1",
        text: "I'm doing well, thanks for asking!",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user2",
        text: "What have you been up to?👍",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user1",
        text: "Just working on some projects.📽️",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user2",
        text: "🤩",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user1",
        text: "😘",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user2",
        text: "Sounds interesting!",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user1",
        text: "I'm doing well, thanks for asking!",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user2",
        text: "I'm doing well, thanks for asking!",
        timestamp: new Date().getTime(),
      },
      {
        senderId: "user2",
        text: "🎈",
        timestamp: new Date().getTime(),
      },
    ];
    setMessages(mockMessages);

    // return () => unsubscribe();
  }, []);

  /* useEffect(() => {
    if (!chatRoomId) return;

    const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data ? Object.values(data) : [];
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatRoomId]); */

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, {
      senderId: userId,
      text: newMessage,
      //timestamp: serverTimestamp(),
    });

    const chatRoomRef = ref(database, `chatRooms/${chatRoomId}`);
    await update(chatRoomRef, {
      lastActive: serverTimestamp(), // Set or update the lastActive timestamp
    });

    setNewMessage("");
    //scrollToBottom();
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const atBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      setShowScrollButton(!atBottom);
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    console.log(container);

    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Handle Skip button click
  const handleSkip = () => {
    deleteChatRoom(); // Delete chat room when skipping
    onSkip(); // Call onSkip prop to navigate away or handle skip action
  };
  const emojiRegex = /[\p{Emoji}]/u;

  return (
    <div className="flex flex-col h-screen pt-[4.3rem]">
      <Header />
      <div
        ref={chatContainerRef}
        className="flex-grow pb-0 p-2 flex-1 max-h-[calc(100vh-8.1rem)] overflow-y-auto bg-gray-100 dark:bg-slate-900"
      >
          <h3 className="text-center dark:text-blue-300 text-blue-800 mb-1">Matched with</h3>
        <div className="flex flex-wrap justify-center space-x-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="bg-blue-200 dark:bg-blue-800 dark:bg-opacity-40 text-blue-800 dark:text-blue-300 px-3 mb-2 py-1 pb-2 rounded-lg"
            >
              {interest}
            </span>
          ))}
        </div>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              message.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[95%] md:max-w-[70%] px-4 py-2 rounded-xl shadow-xl animate-3d-container ${
                message.senderId === userId
                  ? "bg-gradient-to-br from-indigo-400 to-blue-700 dark:from-blue-950 dark:to-indigo-950 text-slate-200 dark:text-slate-300 rounded-br-none"
                  : "bg-gradient-to-tl from-slate-200 to-gray-300 dark:from-indigo-950 dark:to-gray-800 text-black dark:text-slate-300 rounded-bl-none"
              }`+`${emojiRegex.test(message.text)&& message.text.length<3?' duration-500 bg-non hover:bg-none hover:shadow-none rounded-[360px] shadow-none':''}`}
            >
              <p className={`break-words ${emojiRegex.test(message.text)&& message.text.length<3?'text-6xl animate-zoom animate-cute':''}`}>{message.text}</p>
              <span className="text-xs mt-1 w-full flex justify-end text-inherit opacity-70 dark:text-gray-400">
                {/* {new Date(message.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })} */}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <div className="fixed bottom-24 left-0 right-0 text-center">
          <button
            onClick={scrollToBottom}
            className="bg-blue-500 dark:bg-slate-800 border-slate-300 dark:border-slate-700 border-2 hover:bg-blue-600 text-white hover:scale-0 md:hover:scale-100 md:active:scale-0 md:active:translate-y-0 active:translate-y-20  duration-300 px-4 py-2 rounded-full shadow-lg"
          >
            ↓
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 fixed bottom-0 right-0 left-0 grid grid-cols-[auto_minmax(0,_1fr)_auto] items-center p-2 border-t border-gray-200 dark:border-slate-700 gap-2">
        <button
          onClick={handleSkip}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Skip
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="border rounded-md p-2 outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white dark:border-slate-600 w-full"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default StyleChatRoom;
