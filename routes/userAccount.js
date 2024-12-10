const express = require('express');
const { updateUserProfile } = require('../controllers/userAccountController.js'); 
const { verifyToken } = require('../utils/jwtUtils');

const router = express.Router();

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = verifyToken(token); 
        req.user = decoded;                
        next();                            
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// Add route to update user profile
router.put('/update-profile', authenticate, updateUserProfile);

module.exports = router;
