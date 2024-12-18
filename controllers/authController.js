const bcrypt = require('bcryptjs');
const { getDB } = require('../config/db');
const { generateToken, verifyToken } = require('../utils/jwtUtils');

// Register a new user (Email serves as the unique identifier)
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const db = getDB();

    try {
        // Check if the user already exists
        const userExists = await db.collection('user').findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash the password and insert the new user into the database
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('user').insertOne({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const db = getDB();

    try {
        // Fetch the user from the database by email
        const user = await db.collection('user').findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate a JWT with the user's email
        const token = generateToken({ email: user.email });
        const username = user.username;

        res.status(200).json({ token, username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to authenticate a returning user until the token expires
exports.authenticateUser = async (req, res) => {
    try {
        // Retrieve the token from the Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ valid: false, message: 'No token provided' });
        }

        // Verify the token using the JWT secret
        const decoded = verifyToken(token);

        // Optionally: Check if the user exists in the database (ensures the token is for a valid user)
        const db = getDB();
        const user = await db.collection('user').findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({ valid: false, message: 'User not found' });
        }

        // If all checks pass, return true
        return res.status(200).json({ valid: true });
    } catch (err) {
        // If verification fails, return false
        return res.status(401).json({ valid: false, message: 'Invalid token' });
    }
};