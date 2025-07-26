const { Message } = require('./database');

// In-Memory-Speicher für Benutzer pro Raum und Tipp-Status
const usersByRoom = {};
const typingUsers = new Set();

function initializeFeatures(io) {
  // Funktion zum Senden der aktualisierten Benutzerliste an einen Raum
  const updateUserList = (room) => {
    if (usersByRoom[room]) {
      io.to(room).emit('user-list-update', Array.from(usersByRoom[room]));
    }
  };

  return (socket) => {
    // Feature: "Benutzer tippt..."-Indikator
    socket.on('typing', ({ room, isTyping }) => {
      if (isTyping) {
        typingUsers.add(socket.username);
      } else {
        typingUsers.delete(socket.username);
      }
      // Sendet die Info an alle ANDEREN im Raum
      socket.to(room).emit('user-typing-update', { 
        username: socket.username, 
        isTyping 
      });
    });

    // Logik, die beim Verlassen/Trennen der Verbindung ausgeführt wird
    const handleLeave = () => {
      if (!socket.username || !socket.currentRoom) return;

      // Aus "Tippt"-Liste entfernen
      typingUsers.delete(socket.username);
      socket.to(socket.currentRoom).emit('user-typing-update', { 
        username: socket.username, 
        isTyping: false 
      });

      // Aus Benutzerliste des Raumes entfernen und alle informieren
      if (usersByRoom[socket.currentRoom]) {
        usersByRoom[socket.currentRoom].delete(socket.username);
        updateUserList(socket.currentRoom);
      }
    };

    socket.on('leave', handleLeave);
    socket.on('disconnect', handleLeave);

    // Hilfsfunktion, um einen Benutzer zu einem Raum hinzuzufügen
    socket.addUserToRoom = (username, room) => {
      if (!usersByRoom[room]) {
        usersByRoom[room] = new Set();
      }
      usersByRoom[room].add(username);
      updateUserList(room);
    };

    // Hilfsfunktion zum Abrufen der Raum-History mit Zeitstempeln
    socket.getHistory = async (room) => {
      const history = await Message.findAll({
        where: { room },
        order: [['createdAt', 'ASC']],
        limit: 50,
      });
      // Sende History mit Zeitstempeln
      return history.map(m => ({ 
        user: m.author, 
        text: m.content, 
        timestamp: m.createdAt // Feature: Zeitstempel
      }));
    };

    // Hilfsfunktion zum Erstellen einer Nachricht mit Zeitstempel
    socket.createMessage = async ({ room, text }) => {
      const sanitizedText = text.replace(/<[^>]*>/g, '');
      await Message.create({
        content: sanitizedText,
        room,
        author: socket.username,
      });
      // Sende Nachricht mit Zeitstempel
      return { 
        user: socket.username, 
        text: sanitizedText, 
        timestamp: new Date() // Feature: Zeitstempel
      };
    };
  };
}

module.exports = { initializeFeatures };
