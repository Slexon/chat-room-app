import React from 'react';

function OnlineUsers({ users }) {
  if (!users || users.length === 0) {
    return null; // Zeige nichts an, wenn keine Benutzer da sind
  }

  return (
    <div className="w-48 bg-gray-100 p-4 rounded-l-xl shadow-inner hidden md:flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">Online ({users.length})</h3>
      <ul className="space-y-2 overflow-y-auto">
        {users.map((user) => (
          <li key={user} className="flex items-center space-x-2 text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{user}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OnlineUsers;
