import { useState, useEffect } from 'react';

function FavoriteButton({ username, room }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    return import.meta.env.VITE_API_URL || 'https://your-backend-service.onrender.com';
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/favorites/${username}`);
      const favorites = await response.json();
      setIsFavorite(favorites.includes(room));
    } catch (error) {
      console.error('Fehler beim Laden der Favoriten:', error);
    }
  };

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`${getApiUrl()}/api/favorites`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, room }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Fehler beim Ändern der Favoriten:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username && room) {
      checkFavoriteStatus();
    }
  }, [username, room]);

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-all ${
        isFavorite
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-gray-400 hover:text-yellow-500'
      } disabled:opacity-50`}
      aria-label={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill={isFavorite ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  );
}

export default FavoriteButton;
