import { useState, useEffect } from 'react';
import AuthManager from './components/AuthManager.jsx';
import JoinRoom from './components/JoinRoom.jsx';
import ChatRoom from './components/ChatRoom.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleJoin = (user, rm) => {
    if (!user || !rm) return;
    setUsername(user);
    setRoom(rm);
    setInRoom(true);
  };

  const handleLeave = () => {
    setInRoom(false);
    setRoom('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInRoom(false);
    setUsername('');
    setRoom('');
    localStorage.removeItem('chatUser');
  };

  // Prüfe bei App-Start, ob User bereits eingeloggt ist
  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUsername(userData.username);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      {!isAuthenticated ? (
        <AuthManager onLogin={handleLogin} />
      ) : inRoom ? (
        <ChatRoom username={username} room={room} onLeave={handleLeave} />
      ) : (
        <div className="relative">
          <button
            onClick={handleLogout}
            className="absolute -top-12 right-0 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Abmelden
          </button>
          <JoinRoom onJoin={handleJoin} username={username} />
        </div>
      )}
    </div>
  );
}

export default App;
