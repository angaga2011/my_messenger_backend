const { getDB } = require('../config/db');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.updateUserProfile = async (req, res) => {
    const db = getDB();
    const { nickname } = req.body; // Get the new values from the request body

    try {
        // Access the user's email from the token
        const userEmail = req.user.email;

        // Define the update object dynamically
        const updateFields = {};
        if (nickname) updateFields.nickname = nickname;
        if (req.file) updateFields.avatar = req.file.buffer;

        // Update the user's profile in the database
        const result = await db.collection('user').updateOne(
            { email: userEmail },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Export multer upload configuration
exports.upload = upload;