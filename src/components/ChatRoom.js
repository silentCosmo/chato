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
import { database } from "../firebase/config";
import Header from "./Header";
import { useWebRTCCall } from "@/hooks/useWebRTCCall";
import IncomingCallModal from "./chat/IncomingCallModal";
import ActiveCallView from "./chat/ActiveCallView";

import {
  PhoneIcon,
  VideoCameraIcon,
  PaperAirplaneIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const ChatRoom = ({ chatRoomId, userId, initialMatchType, onSkip }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [interests, setInterests] = useState(["HelBeKu"]);
  const [chatStatus, setChatStatus] = useState("active");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [peerUserId, setPeerUserId] = useState(null);
  const [roomMatchType, setRoomMatchType] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const emojiRegex = /[\p{Emoji}]/u;

  // Subscribe to room matchType from Firebase (authoritative source)
  useEffect(() => {
    if (!chatRoomId) return;
    const matchTypeRef = ref(database, `chatRooms/${chatRoomId}/matchType`);
    const unsubscribeMatchType = onValue(matchTypeRef, (snapshot) => {
      const type = snapshot.val();
      if (type) {
        setRoomMatchType(type);
      } else if (initialMatchType) {
        setRoomMatchType(initialMatchType);
      } else {
        setRoomMatchType('text');
      }
    });
    return () => unsubscribeMatchType();
  }, [chatRoomId, initialMatchType]);

  // Track peer user ID in current room
  useEffect(() => {
    if (!chatRoomId || !userId) return;
    const participantsRef = ref(database, `chatRooms/${chatRoomId}/participants`);
    const unsubscribe = onValue(participantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const peer = Object.keys(data).find((id) => id !== userId);
        if (peer) setPeerUserId(peer);
      }
    });
    return () => unsubscribe();
  }, [chatRoomId, userId]);

  // WebRTC Calling System hook integration
  const {
    callState,
    callType,
    localStream,
    remoteStream,
    isMicMuted,
    isCameraOff,
    errorMessage,
    startCall,
    acceptCall,
    declineIncomingCall,
    hangUp,
    toggleMic,
    toggleCamera,
  } = useWebRTCCall({ chatRoomId, userId, peerUserId, roomMatchType });

  useEffect(() => {
    if (!chatRoomId) return;

    // 1. Subscribe to messages
    const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data ? Object.values(data) : [];
      setMessages(loadedMessages);
    });

    // 2. Subscribe to interests (preserved in state)
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

  // Handle Skip / Disconnect button click
  const handleSkip = () => {
    if (callState !== "idle") {
      hangUp();
    }
    if (chatRoomId) {
      set(ref(database, `chatRooms/${chatRoomId}/status`), "disconnected")
        .catch((err) => console.error("Error setting status:", err));
      remove(ref(database, `matches/${userId}`))
        .catch((err) => console.error("Error removing match:", err));
    }
    onSkip();
  };

  // Determine if active call view should be rendered
  const isCallActive =
    (callState === "calling" ||
      callState === "connecting" ||
      callState === "connected" ||
      callState === "failed" ||
      callState === "permission_denied") &&
    (callType === "audio" || callType === "video");

  const isVideoCallActive = isCallActive && callType === "video";

  return (
    <div className="flex flex-col h-screen pt-[4.3rem] bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950/70 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* 1. Global Application Header (Preserved) */}
      <Header />

      {/* 2. Chat-Specific Toolbar (Positioned directly below global Header) */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-xs shrink-0 z-20">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-300 dark:border-slate-600">
              <UserIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white dark:border-slate-800 ${
                chatStatus === "active" ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Stranger
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {chatStatus === "active" ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Right: Refined Heroicons Call Action Buttons */}
        {chatStatus === "active" && callState === "idle" && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => startCall("audio")}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all duration-150 active:scale-95 flex items-center gap-1.5 text-xs font-medium"
              title="Start Audio Call"
              aria-label="Start Audio Call"
            >
              <PhoneIcon className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline font-semibold">Audio</span>
            </button>
            <button
              type="button"
              onClick={() => startCall("video")}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all duration-150 active:scale-95 flex items-center gap-1.5 text-xs font-medium"
              title="Start Video Call"
              aria-label="Start Video Call"
            >
              <VideoCameraIcon className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline font-semibold">Video</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Incoming Call Modal Overlay */}
      {callState === "incoming" && (
        <IncomingCallModal
          callType={callType}
          onAccept={acceptCall}
          onDecline={declineIncomingCall}
        />
      )}

      {/* 4. Chat Workspace & Call Presentation Container (Responsive 65/35 layout for Video) */}
      <div className={`flex-1 flex overflow-hidden relative ${isVideoCallActive ? "flex-col md:flex-row" : "flex-col"}`}>
        {/* Active Call Presentation Area */}
        {isCallActive && (
          <div className={isVideoCallActive ? "w-full md:w-[65%] shrink-0 flex flex-col" : "w-full shrink-0"}>
            <ActiveCallView
              callState={callState}
              callType={callType}
              localStream={localStream}
              remoteStream={remoteStream}
              isMicMuted={isMicMuted}
              isCameraOff={isCameraOff}
              errorMessage={errorMessage}
              onToggleMic={toggleMic}
              onToggleCamera={toggleCamera}
              onHangUp={hangUp}
            />
          </div>
        )}

        {/* Messages Container (Takes 35% on Desktop Video Call, or 100% on Text/Audio Calls) */}
        <div
          ref={chatContainerRef}
          className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-4 space-y-3 relative"
        >
          {chatStatus === "disconnected" && (
  <div className="flex justify-center my-5 shrink-0">
    <div
      className="
        relative
        w-full
        max-w-sm
        px-5
        py-4
        rounded-2xl

        bg-white/80
        dark:bg-slate-800/70

        backdrop-blur-xl

        border
        border-slate-200/80
        dark:border-slate-700/80

        shadow-sm
        dark:shadow-black/10

        text-center

        animate-fade-in
      "
    >
      {/* Status indicator */}
      <div className="flex justify-center mb-2.5">
        <div
          className="
            w-9
            h-9
            rounded-full

            bg-slate-100
            dark:bg-slate-800/70

            border
            border-slate-200
            dark:border-slate-700

            flex
            items-center
            justify-center
          "
        >
          <span
            className="
              w-2.5
              h-2.5
              rounded-full
              bg-slate-400
              dark:bg-slate-600
            "
          />
        </div>
      </div>

      {/* Title */}
      <p
        className="
          text-sm
          font-semibold
          text-slate-800
          dark:text-slate-200
        "
      >
        Conversation ended
      </p>

      {/* Description */}
      <p
        className="
          mt-1
          text-xs
          leading-relaxed
          text-slate-500
          dark:text-slate-400
        "
      >
        The stranger has left this chat.
      </p>

      {/* Divider */}
      <div
        className="
          w-8
          h-px
          mx-auto
          my-3
          bg-slate-200
          dark:bg-slate-700
        "
      />

      {/* Hint */}
      <p
        className="
          text-[11px]
          font-medium
          tracking-wide
          text-blue-500
          dark:text-blue-400
        "
      >
        Start a new chat when you're ready
      </p>
    </div>
  </div>
)}

          {messages.map((message, index) => {
            const isMe = message.senderId === userId;
            const isEmoji = emojiRegex.test(message.text) && message.text.length < 3;

            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-xs text-sm sm:text-base leading-relaxed break-words ${
                    isMe
                      ? "bg-gradient-to-br from-indigo-400 to-blue-700 dark:from-blue-950 dark:to-indigo-950 text-slate-200 dark:text-slate-300 rounded-br-none"
                : "bg-gradient-to-tr from-slate-200 to-gray-300 dark:from-indigo-950 dark:to-slate-950/30 text-black dark:text-slate-300 rounded-bl-none"
                  } ${isEmoji ? "bg-transparent! border-none! shadow-none! text-5xl! p-0!" : ""}`}
                >
                  <p className={isEmoji ? "text-5xl" : ""}>{message.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      {showScrollButton && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-30">
          <button
            type="button"
            onClick={scrollToBottom}
            className="bg-slate-800/90 hover:bg-slate-800 text-white p-2.5 rounded-full shadow-lg border border-slate-700 backdrop-blur-md transition-all duration-200 active:scale-95 pointer-events-auto flex items-center justify-center"
            title="Scroll to bottom"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Cohesive Message Composer Bar */}
      <div className="bg-gray-300 dark:bg-slate-900/90 border-t border-gray-200/80 dark:border-slate-800/80 p-3 sm:p-4 flex items-center gap-2.5 shrink-0 z-20 transition-colors duration-200">
        {/* Skip / New Chat Action Button */}
        <button
          type="button"
          onClick={handleSkip}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-all duration-150 flex items-center gap-1.5 active:scale-95 shadow-xs ${
            chatStatus === "disconnected"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          }`}
          title={chatStatus === "disconnected" ? "Start New Chat" : "Skip Stranger"}
        >
          {chatStatus === "disconnected" ? (
            <>
              <ArrowPathIcon className="w-4 h-4" />
              <span className="hidden">New Chat</span>
            </>
          ) : (
            <>
              <ArrowRightIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Skip</span>
            </>
          )}
        </button>

        {/* Integrated Input & Send Container */}
        <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-700/60 border border-slate-200/90 dark:border-slate-600/90 rounded-2xl px-3 py-1 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all">
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
                ? "Stranger left - click New Chat"
                : "Type a message..."
            }
            disabled={chatStatus === "disconnected"}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none min-h-[38px] max-h-[120px] py-2 overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={chatStatus === "disconnected" || !newMessage.trim()}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 text-white shrink-0 transition-all duration-150 active:scale-95 disabled:active:scale-100 flex items-center justify-center"
            title="Send message"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
