import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import MessageInput from './MessageInput.jsx';

const socket = io('http://localhost:3001');

function ChatRoom({ username, room, onLeave }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join', { username, room });
    console.log('Emitted join for', username, room);

    socket.on('history', (history) => {
      setMessages(history);
      console.log('Received history:', history);
    });
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leave', { username, room });
      socket.off('history');
      socket.off('message');
    };
  }, [username, room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text) return;
    socket.emit('message', { room, text });
  };

  const getAvatarInitial = (user) => user.charAt(0).toUpperCase();

  const handleLeaveClick = () => {
    onLeave();
  };

  return (
    <div className="bg-white w-full max-w-xl h-[80vh] flex flex-col rounded-xl shadow-lg md:max-w-2xl"> {/* Breiter: max-w-xl -> md:max-w-2xl */}
      <div className="chat-header">
        <button
          onClick={handleLeaveClick}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 focus:outline-none hover:scale-110 transition-all"
          aria-label="ChatRoom verlassen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        ChatRoom: {room}
      </div>
      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 flex items-center message ${msg.user === username ? 'justify-end' : 'justify-start'}`}
          >
            {msg.user !== username && (
              <div className="avatar other">{getAvatarInitial(msg.user)}</div>
            )}
            <div className={`chat-bubble ${msg.user === username ? 'self' : 'other'}`}>
              <strong>{msg.user}:</strong> {msg.text}
            </div>
            {msg.user === username && (
              <div className="avatar self">{getAvatarInitial(msg.user)}</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={sendMessage} />
    </div>
  );
}

export default ChatRoom;