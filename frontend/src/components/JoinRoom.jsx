import { useState } from 'react';
import FavoritesList from './FavoritesList.jsx';

function JoinRoom({ onJoin, username }) {
  const [room, setRoom] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && room) {
      onJoin(username, room);
    } else {
      console.error('Username or room missing');
    }
  };

  const handleJoinFromFavorites = (favoriteRoom) => {
    setShowFavorites(false);
    onJoin(username, favoriteRoom);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center font-bold">ChatRoom beitreten</h2>
        <div className="mb-2">
          <span className="text-sm text-gray-600">Angemeldet als: </span>
          <span className="font-semibold">{username}</span>
        </div>
        <input
          type="text"
          placeholder="Room-ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="border p-2 mb-4 w-full rounded-md focus:outline-none focus:border-blue-500"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600 transition-all mb-2">
          Beitreten
        </button>
        <button
          type="button"
          onClick={() => setShowFavorites(true)}
          className="bg-yellow-500 text-white p-2 w-full rounded-md hover:bg-yellow-600 transition-all"
        >
          Meine Favoriten
        </button>
      </form>
      
      {showFavorites && (
        <FavoritesList
          username={username}
          onJoinRoom={handleJoinFromFavorites}
          onClose={() => setShowFavorites(false)}
        />
      )}
    </div>
  );
}

export default JoinRoom;
