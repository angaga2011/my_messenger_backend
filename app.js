const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');
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

const corsOptions = {
    origin: 'https://messenger-frontend-vz3n.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);

// Initialize Socket.io for handling messages
handleSocket(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
