const express = require('express');
const { addContact, getUserContacts, deleteContact } = require('../controllers/userContactsController');
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
        req.user = decoded; // Attach the decoded email to req.user
        next(); // Proceed to the controller
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// Route to add contacts
router.post('/add-contact', authenticate, addContact);

// Route to get contacts for the authenticated user
router.get('/get-user-contacts', authenticate, getUserContacts);

// Route to delete a contact
router.delete('/delete-contact', authenticate, deleteContact);

module.exports = router;