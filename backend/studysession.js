const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
  const sessions = new Map();

  io.on('connection', (socket) => {
    socket.on('createSession', (callback) => {
      const sessionId = uuidv4();
      sessions.set(sessionId, { participants: [socket.id], messages: [] });
      socket.join(sessionId);
      callback(sessionId);
    });

    socket.on('joinSession', (sessionId, callback) => {
      if (sessions.has(sessionId)) {
        const session = sessions.get(sessionId);
        session.participants.push(socket.id);
        socket.join(sessionId);
        socket.to(sessionId).emit('participantJoined', { id: socket.id });
        callback(true);
      } else {
        callback(false);
      }
    });

    socket.on('sendMessage', ({ sessionId, message }) => {
      if (sessions.has(sessionId)) {
        const newMessage = { sender: socket.id, text: message };
        sessions.get(sessionId).messages.push(newMessage);
        io.to(sessionId).emit('newMessage', newMessage);
      }
    });

    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (sessions.has(room)) {
          const session = sessions.get(room);
          session.participants = session.participants.filter(id => id !== socket.id);
          if (session.participants.length === 0) {
            sessions.delete(room);
          } else {
            socket.to(room).emit('participantLeft', socket.id);
          }
        }
      }
    });
  });
};