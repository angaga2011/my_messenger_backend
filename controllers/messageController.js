const { getDB } = require('../config/db');

exports.handleSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join a room
        socket.on('join', (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        });

        // Handle send_message event
        socket.on('send_message', async (data) => {
            console.log('Raw message data received:', data); // Add this log
            const { sender, receiver, content } = data;
            const db = getDB();

            try {
                const message = { sender, receiver, content, createdAt: new Date() };
                await db.collection('messages').insertOne(message);

                // Emit the message to the receiver's room
                io.to(receiver).emit('receive_message', message);
                socket.emit('message_saved', { success: true });
                console.log('Message saved and emitted:', message);
            } catch (err) {
                console.error('Error saving message:', err.message);
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};