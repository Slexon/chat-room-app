import { useState } from 'react';

function JoinRoom({ onJoin }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && room) {
      onJoin(username, room);
    } else {
      console.error('Username or room missing');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl mb-4 text-center font-bold">ChatRoom beitreten</h2>
      <input
        type="text"
        placeholder="Benutzername"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-2 w-full rounded-md focus:outline-none focus:border-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Room-ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="border p-2 mb-4 w-full rounded-md focus:outline-none focus:border-blue-500"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600 transition-all">Beitreten</button>
    </form>
  );
}

export default JoinRoom;
