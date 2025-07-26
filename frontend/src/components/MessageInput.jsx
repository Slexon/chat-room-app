import { useState } from 'react';

function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (onTyping) {
      onTyping();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex bg-white">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Nachricht eingeben..."
        className="flex-1 border-t p-4 focus:outline-none"
      />
      <button type="submit" className="bg-blue-500 text-white px-6 py-4 hover:bg-blue-600 transition-all font-bold">Senden</button>
    </form>
  );
}

export default MessageInput;
