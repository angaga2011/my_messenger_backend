const express = require('express');
const { registerUser, loginUser, authenticateUser } = require('../controllers/authController');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Authentication for Returning Users
router.get('/authenticate', authenticateUser);

module.exports = router;

// In the auth.js file, we define the routes for registering a new user, logging in a user, and authenticating a returning user.
// We import the registerUser, loginUser, and authenticateUser functions from the authController.js file and use them as route 
// handlers for the respective routes.