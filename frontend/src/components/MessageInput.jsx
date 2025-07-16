import { useState } from 'react';

function MessageInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex bg-white rounded-b-xl shadow-top">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nachricht eingeben..."
        className="flex-1 border p-2 rounded-l-md focus:outline-none focus:border-blue-500"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition-all">Senden</button>
    </form>
  );
}

export default MessageInput;
