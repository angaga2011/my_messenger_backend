const { getDB } = require('../config/db');

exports.updateUserProfile = async (req, res) => {
    const db = getDB();
    const { email, nickname } = req.body; // Get the new values from the request body

    try {
        // Access the user's email from the token
        const userEmail = req.user.email;

        // Define the update object dynamically
        const updateFields = {};
        if (email) updateFields.email = email;
        if (nickname) updateFields.nickname = nickname;

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
