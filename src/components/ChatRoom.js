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

// Custom hook to handle unload confirmation and cleanup
const useUnloadConfirmation = (shouldConfirm, callback) => {
  /*
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (shouldConfirm) {
        event.preventDefault();
        event.returnValue = "";
        callback();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldConfirm, callback]);
  */
};

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
  const textareaRef = useRef(null);

  const emojiRegex = /[\p{Emoji}]/u;

  // ============================================================
  // AUTHORITATIVE ROOM MATCH TYPE
  // ============================================================

  useEffect(() => {
    if (!chatRoomId) return;

    const matchTypeRef = ref(
      database,
      `chatRooms/${chatRoomId}/matchType`
    );

    const unsubscribeMatchType = onValue(
      matchTypeRef,
      (snapshot) => {
        const type = snapshot.val();

        if (type) {
          setRoomMatchType(type);
        } else if (initialMatchType) {
          setRoomMatchType(initialMatchType);
        } else {
          setRoomMatchType("text");
        }
      }
    );

    return () => unsubscribeMatchType();
  }, [chatRoomId, initialMatchType]);

  // ============================================================
  // TRACK PEER USER
  // ============================================================

  useEffect(() => {
    if (!chatRoomId || !userId) return;

    const participantsRef = ref(
      database,
      `chatRooms/${chatRoomId}/participants`
    );

    const unsubscribe = onValue(
      participantsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const peer = Object.keys(data).find(
            (id) => id !== userId
          );

          if (peer) {
            setPeerUserId(peer);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [chatRoomId, userId]);

  // ============================================================
  // WEBRTC CALLING SYSTEM
  // DO NOT TOUCH
  // ============================================================

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
  } = useWebRTCCall({
    chatRoomId,
    userId,
    peerUserId,
    roomMatchType,
  });

  // ============================================================
  // FIREBASE CHAT SUBSCRIPTIONS
  // ============================================================

  useEffect(() => {
    if (!chatRoomId) return;

    // 1. Messages
    const messagesRef = ref(
      database,
      `chatRooms/${chatRoomId}/messages`
    );

    const unsubscribeMessages = onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val();
        const loadedMessages = data
          ? Object.values(data)
          : [];

        setMessages(loadedMessages);
      }
    );

    // 2. Interests
    const interestsRef = ref(
      database,
      `chatRooms/${chatRoomId}/matchedInterests`
    );

    const unsubscribeInterests = onValue(
      interestsRef,
      (snapshot) => {
        const data = snapshot.val();

        setInterests(
          data
            ? Object.values(data)
            : []
        );
      }
    );

    // 3. Chat status
    const statusRef = ref(
      database,
      `chatRooms/${chatRoomId}/status`
    );

    const unsubscribeStatus = onValue(
      statusRef,
      (snapshot) => {
        const status = snapshot.val();

        if (status) {
          setChatStatus(status);
        }
      }
    );

    // 4. Disconnect cleanup
    const disconnectRef = onDisconnect(statusRef);

    disconnectRef
      .set("disconnected")
      .catch((err) =>
        console.error(
          "onDisconnect status error:",
          err
        )
      );

    return () => {
      unsubscribeMessages();
      unsubscribeInterests();
      unsubscribeStatus();

      disconnectRef
        .cancel()
        .catch((err) =>
          console.error(
            "onDisconnect cancel error:",
            err
          )
        );
    };
  }, [chatRoomId]);

  // ============================================================
  // MESSAGE SCROLL
  // ============================================================

  useEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const scrollToBottom = () => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const sendMessage = async () => {
    if (
      newMessage.trim() === "" ||
      chatStatus === "disconnected"
    ) {
      return;
    }

    const messagesRef = ref(
      database,
      `chatRooms/${chatRoomId}/messages`
    );

    const newMessageRef = push(messagesRef);

    await set(newMessageRef, {
      senderId: userId,
      text: newMessage,
      timestamp: Date.now(),
    });

    const chatRoomRef = ref(
      database,
      `chatRooms/${chatRoomId}`
    );

    await update(chatRoomRef, {
      lastActive: serverTimestamp(),
    });

    setNewMessage("");

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }

    scrollToBottom();
  };

  // ============================================================
  // SCROLL DETECTION
  // ============================================================

  const handleScroll = () => {
    const container = chatContainerRef.current;

    if (!container) return;

    const atBottom =
      container.scrollHeight -
      container.scrollTop <=
      container.clientHeight + 30;

    setShowScrollButton(!atBottom);
  };

  useEffect(() => {
    const container =
      chatContainerRef.current;

    if (!container) return;

    container.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      container.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  // ============================================================
  // TEXTAREA AUTO RESIZE
  // ============================================================

  const handleTextareaChange = (event) => {
    const textarea = event.target;

    setNewMessage(textarea.value);

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      120
    )}px`;
  };

  // ============================================================
  // SKIP / DISCONNECT
  // ============================================================

  const handleSkip = () => {
    if (callState !== "idle") {
      hangUp();
    }

    if (chatRoomId) {
      set(
        ref(
          database,
          `chatRooms/${chatRoomId}/status`
        ),
        "disconnected"
      ).catch((err) =>
        console.error(
          "Error setting status:",
          err
        )
      );

      remove(
        ref(
          database,
          `matches/${userId}`
        )
      ).catch((err) =>
        console.error(
          "Error removing match:",
          err
        )
      );
    }

    onSkip();
  };

  // ============================================================
  // CALL UI STATE
  // ============================================================

  const isCallActive =
    (callState === "calling" ||
      callState === "connecting" ||
      callState === "connected" ||
      callState === "failed" ||
      callState === "permission_denied") &&
    (callType === "audio" ||
      callType === "video");

  const isIncomingCall =
    callState === "incoming";

  const isConnectedCall =
    callState === "connected";

  const isCalling =
    callState === "calling" ||
    callState === "connecting";

  const hasMessages = messages.length > 0;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* ======================================================
          TOP HEADER
      ====================================================== */}

      <Header />

      {/* ======================================================
          MAIN APPLICATION SHELL
      ====================================================== */}

      <div className="flex h-full flex-col pt-[4.3rem]">

        {/* ====================================================
            CHAT TOP BAR
        ==================================================== */}

        <div className="z-20 border-b border-gray-200 bg-white/95 px-3 py-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-5">

          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">

            {/* MATCH INFO */}

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-2">

                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm shadow-md">
                  👤
                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <span className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                      Stranger
                    </span>

                    {chatStatus === "active" && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Online
                      </span>
                    )}

                  </div>

                  <div className="mt-0.5 flex max-w-full items-center gap-1.5 overflow-hidden">

                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Interests
                    </span>

                    <div className="flex min-w-0 gap-1 overflow-x-auto scrollbar-none">

                      {interests.map(
                        (interest, index) => (
                          <span
                            key={index}
                            className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"
                          >
                            {interest}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                CALL BUTTONS
            ================================================== */}

            {chatStatus === "active" &&
              callState === "idle" && (
                <div className="flex shrink-0 items-center gap-1.5">

                  <button
                    onClick={() =>
                      startCall("audio")
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow-md active:scale-90"
                    title="Start audio call"
                    aria-label="Start audio call"
                  >
                    📞
                  </button>

                  <button
                    onClick={() =>
                      startCall("video")
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-90"
                    title="Start video call"
                    aria-label="Start video call"
                  >
                    📹
                  </button>

                </div>
              )}

            {/* CALL STATUS */}

            {isCalling && (
              <div className="flex shrink-0 items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">

                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />

                {callType === "video"
                  ? "Video calling..."
                  : "Calling..."}

              </div>
            )}

            {isConnectedCall && (
              <div className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">

                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                {callType === "video"
                  ? "Video call"
                  : "Audio call"}

              </div>
            )}

          </div>

        </div>

        {/* ====================================================
            SCROLLABLE CHAT CONTENT
        ==================================================== */}

        <main
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain bg-gray-100 px-2 py-4 dark:bg-slate-950 sm:px-4"
        >

          <div className="mx-auto flex w-full max-w-4xl flex-col">

            {/* =================================================
                CALL AREA
            ================================================= */}

            {isIncomingCall && (
              <div className="mb-4">
                <IncomingCallModal
                  callType={callType}
                  onAccept={acceptCall}
                  onDecline={declineIncomingCall}
                />
              </div>
            )}

            {isCallActive && (
              <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
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

            {/* =================================================
                DISCONNECTED STATE
            ================================================= */}

            {chatStatus === "disconnected" && (
              <div className="my-4 flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-white px-5 py-8 text-center shadow-sm dark:border-red-900/40 dark:bg-slate-900">

                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl dark:bg-red-950/50">
                  👋
                </div>

                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Stranger disconnected
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  This conversation has ended. Start a new chat whenever you're ready.
                </p>

                <button
                  onClick={handleSkip}
                  className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
                >
                  ✨ Find Someone New
                </button>

              </div>
            )}

            {/* =================================================
                EMPTY CHAT STATE
            ================================================= */}

            {!hasMessages &&
              chatStatus === "active" &&
              !isCallActive &&
              !isIncomingCall && (
                <div className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">

                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-3xl shadow-lg">
                    💬
                  </div>

                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    You're matched!
                  </h2>

                  <p className="mt-1 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Say something interesting. You never know where the conversation might go.
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">

                    {interests.slice(0, 4).map(
                      (interest, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400"
                        >
                          #{interest}
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* =================================================
                MESSAGES
            ================================================= */}

            <div className="flex flex-col gap-1.5">

              {messages.map(
                (message, index) => {
                  const isMine =
                    message.senderId ===
                    userId;

                  const isEmoji =
                    emojiRegex.test(
                      message.text
                    ) &&
                    message.text.length < 3;

                  return (
                    <div
                      key={index}
                      className={`flex w-full ${isMine
                          ? "justify-end"
                          : "justify-start"
                        }`}
                    >

                      <div
                        className={`group relative max-w-[88%] sm:max-w-[75%] ${isEmoji
                            ? "px-1 py-1"
                            : "px-4 py-2.5"
                          } ${isEmoji
                            ? "bg-transparent shadow-none"
                            : isMine
                              ? "rounded-2xl rounded-br-md bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm"
                              : "rounded-2xl rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                          }`}
                      >

                        <p
                          className={`break-words whitespace-pre-wrap leading-relaxed ${isEmoji
                              ? "animate-zoom text-6xl"
                              : "text-sm sm:text-[15px]"
                            }`}
                        >
                          {message.text}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            <div
              ref={messagesEndRef}
              className="h-2"
            />

          </div>

        </main>

        {/* ====================================================
            SCROLL TO BOTTOM
        ==================================================== */}

        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-[6.5rem] right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-50 active:scale-90 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:right-8"
            aria-label="Scroll to latest messages"
            title="Scroll to latest messages"
          >
            ↓
          </button>
        )}

        {/* ====================================================
            MESSAGE COMPOSER
        ==================================================== */}

        <div className="z-20 border-t border-gray-200 bg-white/95 px-2 py-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-4">

          <div className="mx-auto flex max-w-4xl items-end gap-2">

            {/* DISCONNECT / NEW CHAT */}

            <button
              onClick={handleSkip}
              className={`flex h-11 shrink-0 items-center justify-center rounded-full px-4 text-sm font-semibold text-white shadow-sm transition-all active:scale-95 ${chatStatus === "disconnected"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-500 hover:bg-red-600"
                }`}
            >

              <span className="hidden sm:inline">
                {chatStatus === "disconnected"
                  ? "✨ New Chat"
                  : "Disconnect"}
              </span>

              <span className="sm:hidden">
                {chatStatus === "disconnected"
                  ? "✨"
                  : "×"}
              </span>

            </button>

            {/* MESSAGE INPUT */}

            <div className="relative flex min-h-11 flex-1 items-end rounded-2xl border border-slate-200 bg-slate-50 transition-colors focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800">

              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                placeholder={
                  chatStatus ===
                    "disconnected"
                    ? "Stranger left..."
                    : "Message..."
                }
                disabled={
                  chatStatus ===
                  "disconnected"
                }
                className="max-h-[120px] min-h-[44px] w-full resize-none overflow-y-auto bg-transparent px-4 py-3 pr-3 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder:text-slate-500"
              />

            </div>

            {/* SEND BUTTON */}

            <button
              onClick={sendMessage}
              disabled={
                chatStatus ===
                "disconnected" ||
                !newMessage.trim()
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none active:scale-90 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
              aria-label="Send message"
              title="Send message"
            >
              ➤
            </button>

          </div>

          {/* KEYBOARD HINT */}

          {chatStatus === "active" && (
            <div className="mx-auto hidden max-w-4xl justify-end px-16 pt-1 sm:flex">
              <span className="text-[10px] text-slate-400 dark:text-slate-600">
                Enter to send · Shift + Enter for new line
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ChatRoom;