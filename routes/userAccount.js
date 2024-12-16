const express = require('express');
const { updateUserProfile, deleteUserAccount, upload } = require('../controllers/userAccountController');
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

// POST route to update profile and upload avatar
router.post('/update-profile', authenticate, upload.single('avatar'), updateUserProfile);

// DELETE route to delete user account
router.delete('/delete-account', authenticate, deleteUserAccount);

module.exports = router; // Export the router