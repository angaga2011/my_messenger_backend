const { getDB } = require('../config/db');

exports.handleSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

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

exports.getUserMessages = async (req, res) => {
    const db = getDB();

    try {
        // Access the user's email from the token
        const userEmail = req.user.email;
        console.log('User email:', userEmail);

        // Fetch all messages where the user is either the sender or receiver
        const userMessages = await db.collection('messages')
            .find({ $or: [{ sender: userEmail }, { receiver: userEmail }] })
            .toArray(); // Convert the cursor to an array

        if (!userMessages || userMessages.length === 0) {
            return res.status(404).json({ message: 'No messages found for the user' });
        }

        // Respond with the array of messages
        res.status(200).json(userMessages);
    } catch (err) {
        console.error('Error fetching user messages:', err);
        res.status(500).json({ error: err.message });
    }
};