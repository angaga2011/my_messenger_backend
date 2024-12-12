const express = require('express');
const { createGroup, addParticipant, deleteParticipant, deleteGroup, getUserGroups } = require('../controllers/userGroupsController');
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

// POST route to create a group
router.post('/create-group', authenticate, createGroup);

// POST route to add a participant
router.post('/add-participant', authenticate, addParticipant);

// DELETE route to delete a participant
router.delete('/delete-participant', authenticate, deleteParticipant);

// DELETE route to delete a group
router.delete('/delete-group', authenticate, deleteGroup);

// GET route to fetch user groups
router.get('/get-user-groups', authenticate, getUserGroups);

module.exports = router;