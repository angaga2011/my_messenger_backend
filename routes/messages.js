const express = require('express');
const { getUserMessages } = require('../controllers/messageController');
const { verifyToken } = require('../utils/jwtUtils');

const router = express.Router();

// Middleware to validate JWT
const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.token; // Get the token from cookies

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = verifyToken(token); // Verify the JWT
        req.user = decoded; // Attach the decoded email to req.user
        console.log("Decoded token in middleware:", req.user); // Log for debugging
        next(); // Proceed to the controller
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

router.get('/get-user-messages', authenticate, getUserMessages);

module.exports = router;