import { useState, useEffect } from 'react';

function FavoritesList({ username, onJoinRoom, onClose }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    return import.meta.env.VITE_API_URL || 'https://your-backend-service.onrender.com';
  };

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/favorites/${username}`);
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Fehler beim Laden der Favoriten:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (room) => {
    try {
      const response = await fetch(`${getApiUrl()}/api/favorites`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, room }),
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav !== room));
      }
    } catch (error) {
      console.error('Fehler beim Entfernen der Favoriten:', error);
    }
  };

  useEffect(() => {
    if (username) {
      loadFavorites();
    }
  }, [username]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col">
        <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold">Meine Favoriten</h2>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Schließen
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">Lädt...</div>
          ) : favorites.length > 0 ? (
            <div className="space-y-2">
              {favorites.map((room, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-medium">{room}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onJoinRoom(room)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Beitreten
                    </button>
                    <button
                      onClick={() => removeFavorite(room)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Noch keine Favoriten vorhanden.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesList;
