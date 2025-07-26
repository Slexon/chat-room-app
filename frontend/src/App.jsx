import { useState } from 'react';
import JoinRoom from './components/JoinRoom.jsx';
import ChatRoom from './components/ChatRoom.jsx';

function App() {
  const [inRoom, setInRoom] = useState(false);
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');

  const handleJoin = (user, rm) => {
    if (!user || !rm) return;
    setUsername(user);
    setRoom(rm);
    setInRoom(true);
  };

  const handleLeave = () => {
    setInRoom(false);
    setUsername(''); // Wichtig: Username zurücksetzen
    setRoom('');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      {inRoom ? (
        <ChatRoom username={username} room={room} onLeave={handleLeave} />
      ) : (
        <JoinRoom onJoin={handleJoin} />
      )}
    </div>
  );
}

export default App;
