const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // Für lokale Entwicklung; passe für Prod an
});

// In-Memory-Speicher: Objekt mit Rooms und deren History
const rooms = {};

// Socket-Logik
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Beitreten zu einem Room
  socket.on('join', ({ username, room }) => {
    if (!username || !room) return; // Einfache Validierung
    socket.join(room);
    socket.username = username; // Speichere Username am Socket

    socket.on('leave', ({ username, room }) => {
  if (username && room) {
    io.to(room).emit('message', { user: 'System', text: `${username} hat den Room verlassen.` });
    socket.leave(room);
  }});

    // Initialisiere Room, falls neu
    if (!rooms[room]) rooms[room] = [];

    // Broadcast: User joined
    io.to(room).emit('message', { user: 'System', text: `${username} ist beigetreten.` });

    // Sende Chat-History an neuen User
    socket.emit('history', rooms[room]);
  });

  // Nachricht senden
  socket.on('message', ({ room, text }) => {
    if (!text || !room || !socket.username) return; // Validierung
    const sanitizedText = text.replace(/<[^>]*>/g, ''); // Basisschutz gegen XSS

    const message = { user: socket.username, text: sanitizedText };
    rooms[room].push(message); // Speichere in History

    io.to(room).emit('message', message); // Broadcast
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Starte Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
