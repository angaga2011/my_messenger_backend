const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/userContacts');
const messageRoutes = require('./routes/messages');
const accountRoutes = require('./routes/userAccount');
const groupRoutes = require('./routes/userGroups');
const { handleSocket } = require('./controllers/messagesController');

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

const corsOptions = {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS with the specified options
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/contacts', contactsRoutes); // User contacts routes
app.use('/api/messages', messageRoutes); // Messaging routes
app.use('/api/account', accountRoutes); // User account routes
app.use('/api/groups', groupRoutes); // User groups routes

// Initialize Socket.io for handling messages
handleSocket(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`)); // Listen on the specified port (if running locally) or 5000 (if running on Heroku)
