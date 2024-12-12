const { getDB } = require('../config/db');

// Create Group function
exports.createGroup = async (req, res) => {
    const { groupName, participants } = req.body; // `groupName` is the name of the group, `participants` is the array of participant emails.
    const db = getDB();

    try {
        // Validate if all provided participants exist in the `user` collection
        const validParticipants = [];
        for (const participantEmail of participants || []) {
            const user = await db.collection('user').findOne({ email: participantEmail });
            if (!user) {
                return res.status(400).json({ message: `User with email ${participantEmail} does not exist` });
            }
            validParticipants.push(participantEmail); // Only add valid emails
        }

        // Check if the group already exists
        const groupExists = await db.collection('user_groups').findOne({ groupName });
        if (groupExists) {
            return res.status(400).json({ message: 'Group already exists' });
        }

        // Create the group with the provided participants
        await db.collection('user_groups').insertOne({ groupName, participants: validParticipants });

        res.status(201).json({ message: 'Group created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add Participant function
exports.addParticipant = async (req, res) => {
    const { groupName, participantEmail } = req.body;
    const db = getDB();

    try {
        // Validate if the participant exists in the `user` collection
        const user = await db.collection('user').findOne({ email: participantEmail });
        if (!user) {
            return res.status(400).json({ message: `User with email ${participantEmail} does not exist` });
        }

        // Add the participant to the group
        const result = await db.collection('user_groups').updateOne(
            { groupName },
            { $addToSet: { participants: participantEmail } } // Use $addToSet to avoid duplicates
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({ message: 'Participant added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Participant function
exports.deleteParticipant = async (req, res) => {
    const { groupName, participantEmail } = req.body;
    const db = getDB();

    try {
        // Remove the participant from the group
        const result = await db.collection('user_groups').updateOne(
            { groupName },
            { $pull: { participants: participantEmail } } // Use $pull to remove the participant
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({ message: 'Participant removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Group function
exports.deleteGroup = async (req, res) => {
    const { groupName } = req.body;
    const db = getDB();

    try {
        // Delete the group
        const result = await db.collection('user_groups').deleteOne({ groupName: groupName });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get User Groups function
exports.getUserGroups = async (req, res) => {
    const db = getDB();
    const userEmail = req.user.email;

    try {
        // Fetch all groups where the user is a participant
        const userGroups = await db.collection('user_groups').find({ participants: userEmail }).toArray();

        res.status(200).json({ groups: userGroups });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};