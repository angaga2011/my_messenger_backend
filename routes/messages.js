const express = require('express');
const { getUserMessages } = require('../controllers/messagesController');
const { verifyToken } = require('../utils/jwtUtils');

const router = express.Router();

// Middleware to validate JWT
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']; // Get the Authorization header
        const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' }); // Return 401 if no token is provided
        }

        const decoded = verifyToken(token); // Verify the JWT
        req.user = decoded; // Attach the decoded email to req.user
        next(); // Proceed to the controller
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' }); // Return 401 if the token is invalid
    }
};

// Route to get user messages, protected by the authenticate middleware
router.get('/get-user-messages', authenticate, getUserMessages);

module.exports = router; // Export the router