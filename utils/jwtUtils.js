const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (payload) => {
    return jwt.sign(
        { email: payload.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Verify JWT token
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error('Invalid token');
    }
};

// Separate JWT generatioan and verification functions