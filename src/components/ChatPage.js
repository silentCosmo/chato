'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';

const ChatPage = ({ params }) => {
  const router = useRouter();
  const { chatId } = params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const chatRef = ref(database, `chats/${chatId}`);

    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.messages) {
          setMessages(Object.values(data.messages));
        } else {
          setError('Chat room is empty or does not exist.');
        }
      } else {
        setError('Chat room does not exist.');
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching chat data: ', error);
      setError('Error fetching chat data.');
      setLoading(false);
    });

    return () => {
      // Clean up listeners or other resources
    };
  }, [chatId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const chatRef = ref(database, `chats/${chatId}/messages`);
    const newMessageRef = chatRef.push();
    newMessageRef.set({
      text: newMessage,
      timestamp: Date.now(),
    }).then(() => {
      setNewMessage('');
    }).catch((error) => {
      console.error('Error sending message: ', error);
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Chat</h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded-md">
                {msg.text}
              </li>
            ))}
          </ul>
        )}
      </main>
      <footer className="p-4 bg-gray-200">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatPage;
