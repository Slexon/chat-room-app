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
    console.log('Joining room:', rm, 'as', user);
  };

  const handleLeave = () => {
    setInRoom(false);
    setRoom(''); // Optional: Reset Room für Sicherheit
    console.log('Left room');
  };

  return (
    <div className="chat-container">
      {inRoom ? (
        <ChatRoom username={username} room={room} onLeave={handleLeave} />
      ) : (
        <JoinRoom onJoin={handleJoin} />
      )}
    </div>
  );
}

export default App;
