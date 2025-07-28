import { useState, useEffect } from 'react';

function ChatHistory({ username, room, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    return import.meta.env.VITE_API_URL || 'https://your-backend-service.onrender.com';
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      const response = await fetch(`${getApiUrl()}/api/history/${room}?${params}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Fehler beim Laden der Historie:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportChat = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/export/${room}?username=${username}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-${room}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Fehler beim Export:', error);
      alert('Fehler beim Export der Chat-Historie');
    }
  };

  useEffect(() => {
    loadHistory();
  }, [room, username]);


  // Gruppiere Nachrichten nach Datum
  const groupMessagesByDate = (msgs) => {
    const grouped = {};
    msgs.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleDateString('de-DE');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(msg);
    });
    return grouped;
  };

  // Filter nach Datum
  const filteredMessages = dateFilter
    ? messages.filter(msg => {
        const msgDate = new Date(msg.createdAt);
        const filterDate = new Date(dateFilter);
        return (
          msgDate.getFullYear() === filterDate.getFullYear() &&
          msgDate.getMonth() === filterDate.getMonth() &&
          msgDate.getDate() === filterDate.getDate()
        );
      })
    : messages;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold">Chat-Historie: {room}</h2>
          <div className="flex gap-2">
            <button
              onClick={exportChat}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
            >
              Als TXT exportieren
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Schließen
            </button>
          </div>
        </div>

        <div className="p-4 border-b">
          <div className="flex gap-2 items-center">
            <label className="font-semibold text-gray-700">Nachrichten am Datum:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && filteredMessages.length === 0 ? (
            <div className="text-center py-8">Lädt...</div>
          ) : filteredMessages.length > 0 ? (
            <div>
              {Object.entries(groupMessagesByDate(filteredMessages)).map(([date, msgs]) => (
                <div key={date}>
                  <div className="text-center my-4">
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">{date}</span>
                  </div>
                  <div className="space-y-3">
                    {msgs.map((msg, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-blue-600">{msg.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.createdAt).toLocaleTimeString('de-DE')}
                          </span>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {'Noch keine Nachrichten vorhanden.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;
