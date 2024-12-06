const bcrypt = require('bcryptjs');
const { getDB } = require('../config/db');
const { generateToken } = require('../utils/jwtUtils');

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const db = getDB();

    try {
        const userExists = await db.collection('user').findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

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

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};