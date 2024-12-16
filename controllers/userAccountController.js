const { getDB } = require('../config/db');
const multer = require('multer');

// Configure multer for file uploads (user avatars)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to update all assets of user profile (Not yet in use)
exports.updateUserProfile = async (req, res) => {
    const db = getDB();
    const { nickname } = req.body;

    try {
        const userEmail = req.user.email;

        const updateFields = {};
        if (nickname) updateFields.nickname = nickname;
        if (req.file) updateFields.avatar = req.file.buffer;

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

// Delete user account
exports.deleteUserAccount = async (req, res) => {
    const db = getDB();
    const userEmail = req.user.email;

    try {
        const result = await db.collection('user').deleteOne({ email: userEmail });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Export multer upload configuration (Its not yet in use)
exports.upload = upload;