const { getDB } = require('../config/db');

exports.handleSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('send_message', async (data) => {
            const { sender, receiver, content } = data;
            const db = getDB();

            try {
                const message = { sender, receiver, content, createdAt: new Date() };
                await db.collection('messages').insertOne(message);

                // Emit the message to the receiver
                io.to(receiver).emit('receive_message', message);
            } catch (err) {
                console.error(err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
