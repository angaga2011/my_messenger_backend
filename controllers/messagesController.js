const { getDB } = require('../config/db');

// Function to provide realtime messaging functionality
exports.handleSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle register_email event
        socket.on('register_email', (data) => {
            const { email } = data;
            socket.join(email);
            console.log(`Socket ${socket.id} joined room: ${email}`);
        });

        // Handle send_message event
        socket.on('send_message', async (messageData) => {
            const db = getDB();
            const { sender, receiver, content, isGroup } = messageData;

            const message = {
                sender,
                receiver,
                content,
                createdAt: new Date(),
                isGroup,
            };

            try {
                // Save the message to the database
                await db.collection('messages').insertOne(message);

                // Emit the message to the receiver(s). isGroup determines if the message is for a group or a personal chat, changing the logic of handling it.
                if (isGroup) {
                    // Fetch group participants from db and emit the message to all participants except the sender.
                    const group = await db.collection('user_groups').findOne({ groupName: receiver });
                    if (group) {
                        group.participants.forEach(participant => {
                            if (participant !== sender) {
                                io.to(participant).emit('receive_message', message);
                            }
                        });
                    }
                } else {
                    io.to(receiver).emit('receive_message', message);
                }

                socket.emit('message_saved', { success: true });
                console.log('Message saved and emitted:', message);
            } catch (err) {
                console.error('Error saving message:', err.message);
                socket.emit('message_saved', { success: false, error: err.message });
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};

// Function to fetch all previous messages between the user and a contact
exports.getUserMessages = async (req, res) => {
  const db = getDB();
  const { contactEmail } = req.query;

  try {
    const userEmail = req.user.email;
    console.log('User email:', userEmail);

    // Fetch all messages between the user and the selected contact or group
    const userGroups = await getUserGroups(userEmail, db);
    const isGroup = userGroups.includes(contactEmail);

    const userMessages = await db.collection('messages')
      .find({
        $or: isGroup
          ? [{ receiver: contactEmail }] // Fetch messages for the selected group
          : [
              { sender: userEmail, receiver: contactEmail },
              { sender: contactEmail, receiver: userEmail }
            ] // Fetch messages for the selected personal chat
      })
      .toArray(); // Convert the cursor to an array

    if (!userMessages || userMessages.length === 0) {
      return res.status(404).json({ message: 'No messages found for the user' });
    }

    // Ensure all messages have the isGroup field (Before feature was addes, all messages did not have this field)
    const messagesWithIsGroup = userMessages.map(message => ({
      ...message,
      isGroup: message.isGroup || false
    }));

    // Respond with the array of messages
    res.status(200).json({ messages: messagesWithIsGroup });
  } catch (err) {
    console.error('Error fetching user messages:', err);
    res.status(500).json({ error: err.message });
  }
};

// Helper function to get the groups a user is part of
const getUserGroups = async (userEmail, db) => {
  const groups = await db.collection('user_groups').find({ participants: userEmail }).toArray();
  return groups.map(group => group.groupName);
};