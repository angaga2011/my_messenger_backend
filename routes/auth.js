const express = require('express');
const { registerUser, loginUser, authenticateUser } = require('../controllers/authController');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Testing Authentication for Returning Users
router.post('/authenticate', authenticateUser);

module.exports = router;