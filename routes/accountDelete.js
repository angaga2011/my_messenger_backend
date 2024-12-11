const express = require('express');
const { deleteUserAccount, deleteContact } = require('../controllers/accountDeleteController'); // Updated path
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
        req.user = decoded;                // Attach the decoded data to req.user
        next();                            // Pass control to the next handler
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// Route to delete user account
router.delete('/delete-account', authenticate, deleteUserAccount);

// Route to delete a contact
router.delete('/delete-contact', authenticate, deleteContact);

module.exports = router;
