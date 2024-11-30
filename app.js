// const express = require('express');
// const dotenv = require('dotenv');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const { connectDB } = require('./config/db');
// const authRoutes = require('./routes/auth');
// const { handleSocket } = require('./controllers/messageController');

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
// },
//  });

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // API Routes
// app.use('/api/auth', authRoutes);

// // Initialize Socket.io
// handleSocket(io);

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//Version 1

// const http = require('http');
// const { Server } = require('socket.io');
// const express = require('express');
// const cors = require('cors');
// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// // Create an Express app and HTTP server
// const app = express();
// const server = http.createServer(app);

// // Initialize Socket.io
// const io = new Server(server, {
//     cors: {
//         origin: '*', // Allow all origins for testing
//         methods: ['GET', 'POST'],
//     },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Configuration
// const connectToMongoDB = async () => {
//     try {
//         const client = new MongoClient(process.env.MONGO_URI);

//         await client.connect();
//         console.log('Connected to MongoDB');

//         const db = client.db('messenger'); // Replace 'messenger' with your DB name
//         const messagesCollection = db.collection('messages');
//         const usersCollection = db.collection('user');

//         // Socket.io connection
//         io.on('connection', (socket) => {
//             console.log('A user connected:', socket.id); // Log when a user connects
        
//             socket.on('send_message', async (data) => {
//                 console.log('Message received:', data); // Log the message payload
        
//                 const { sender, receiver, content } = data;
        
//                 // Save the message to MongoDB
//                 try {
//                     const db = getDB(); // Get the database instance
//                     const message = {
//                         sender,
//                         receiver,
//                         content,
//                         createdAt: new Date(),
//                     };
        
//                     await db.collection('messages').insertOne(message); // Save the message
//                     console.log('Message saved to MongoDB:', message);
        
//                     // Emit the message to the receiver
//                     socket.to(receiver).emit('receive_message', message);
//                 } catch (err) {
//                     console.error('Error saving message to MongoDB:', err.message);
//                 }
//             });
        
//             socket.on('disconnect', () => {
//                 console.log('A user disconnected:', socket.id);
//             });
//         });
        
//     } catch (err) {
//         console.error('Error connecting to MongoDB:', err.message);
//         process.exit(1); // Exit process if MongoDB connection fails
//     }
// };

// // Start the server and connect to MongoDB
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, async () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//     await connectToMongoDB();
// });

//Version 2

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const { handleSocket } = require('./controllers/messageController');

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for testing
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);

// Initialize Socket.io for handling messages
handleSocket(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
