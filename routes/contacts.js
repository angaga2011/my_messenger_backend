const express = require('express');
const { addContact, getUserContacts } = require('../controllers/userContactsController');
const { verifyToken } = require('../utils/jwtUtils');

const router = express.Router();

// Middleware to validate JWT
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = verifyToken(token); // Verify the JWT
        req.user = decoded; // Attach decoded token data (e.g., email) to the request object
        console.log("in middleware: ", req.user);
        next(); // Proceed to the controller
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

router.post('/addContact', addContact);

// Route to get contacts for the authenticated user
router.get('/get-user-contacts', authenticate, getUserContacts);

module.exports = router;