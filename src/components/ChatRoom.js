import React, { useEffect, useState, useRef } from "react";
import {
  ref,
  onValue,
  push,
  set,
  update,
  remove,
  serverTimestamp,
  onDisconnect,
} from "firebase/database";
import { database } from "../firebase/config"; // Adjust import as needed
import Header from "./Header";

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

const ChatRoom = ({ chatRoomId, userId, onSkip }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [interests, setInterests] = useState(["HelBeKu"]);
  const [chatStatus, setChatStatus] = useState("active");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const emojiRegex = /[\p{Emoji}]/u;

  useEffect(() => {
    if (!chatRoomId) return;

    // 1. Subscribe to messages
    const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data ? Object.values(data) : [];
      setMessages(loadedMessages);
    });

    // 2. Subscribe to interests
    const interestsRef = ref(database, `chatRooms/${chatRoomId}/matchedInterests`);
    const unsubscribeInterests = onValue(interestsRef, (snapshot) => {
      const data = snapshot.val();
      setInterests(data ? Object.values(data) : []);
    });

    // 3. Subscribe to chat room status
    const statusRef = ref(database, `chatRooms/${chatRoomId}/status`);
    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      if (status) {
        setChatStatus(status);
      }
    });

    // 4. Setup onDisconnect server cleanup
    const disconnectRef = onDisconnect(statusRef);
    disconnectRef.set("disconnected").catch((err) => console.error("onDisconnect status error:", err));

    return () => {
      unsubscribeMessages();
      unsubscribeInterests();
      unsubscribeStatus();
      disconnectRef.cancel().catch((err) => console.error("onDisconnect cancel error:", err));
    };
  }, [chatRoomId]);

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
    if (newMessage.trim() === "" || chatStatus === "disconnected") return;

    const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, {
      senderId: userId,
      text: newMessage,
      timestamp: Date.now(),
    });

    const chatRoomRef = ref(database, `chatRooms/${chatRoomId}`);
    await update(chatRoomRef, {
      lastActive: serverTimestamp(),
    });

    setNewMessage("");
    scrollToBottom();
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const atBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 20;
      setShowScrollButton(!atBottom);
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Handle Skip button click
  const handleSkip = () => {
    if (chatRoomId) {
      set(ref(database, `chatRooms/${chatRoomId}/status`), "disconnected")
        .catch((err) => console.error("Error setting status:", err));
      remove(ref(database, `matches/${userId}`))
        .catch((err) => console.error("Error removing match:", err));
    }
    onSkip();
  };

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

        {chatStatus === "disconnected" && (
          <div className="text-center my-4 p-2 bg-red-100 dark:bg-red-950 dark:bg-opacity-40 text-red-800 dark:text-red-300 rounded-lg text-sm font-semibold animate-zoom">
            🌌 Stranger disconnected. Click &quot;New Chat&quot; to continue.
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-2 ${message.senderId === userId ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[95%] md:max-w-[70%] px-4 py-2 rounded-xl shadow-xl animate-3d-container ${message.senderId === userId
                ? "bg-gradient-to-br from-indigo-400 to-blue-700 dark:from-blue-950 dark:to-indigo-950 text-slate-200 dark:text-slate-300 rounded-br-none"
                : "bg-gradient-to-tl from-slate-200 to-gray-300 dark:from-indigo-950 dark:to-gray-800 text-black dark:text-slate-300 rounded-bl-none"
                }` + `${emojiRegex.test(message.text) && message.text.length < 3 ? ' duration-500 bg-non hover:bg-none hover:shadow-none rounded-[360px] shadow-none' : ''}`}
            >
              <p className={`break-words ${emojiRegex.test(message.text) && message.text.length < 3 ? 'text-6xl animate-zoom animate-cute' : ''}`}>{message.text}</p>
              {/* <span className="text-xs mt-1 flex justify-end opacity-70">
                {message.timestamp &&
                  new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span> */}
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
          className={`${chatStatus === "disconnected"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-red-500 hover:bg-red-600"
            } text-white px-4 py-2 rounded-md transition-colors duration-300`}
        >
          {
            chatStatus === "disconnected"
              ? "New Chat"
              : "Disconnect"
          }
        </button>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          placeholder={
            chatStatus === "disconnected"
              ? "Stranger left - click Next"
              : "Type a message..."
          }
          disabled={chatStatus === "disconnected"}
          className="
            border
            rounded-xl
            p-3
            resize-none
            outline-none
            focus:border-blue-500
            dark:bg-slate-700
            dark:text-white
            dark:border-slate-600
            w-full
            min-h-[44px]
            max-h-[120px]
            overflow-y-auto
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        />
        <button
          onClick={sendMessage}
          disabled={
            chatStatus === "disconnected" ||
            !newMessage.trim()
          }
          className="
    bg-blue-500
    hover:bg-blue-600
    disabled:bg-gray-400
    text-white
    w-12
    h-12
    rounded-full
    flex
    items-center
    justify-center
    transition-all
  "
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
