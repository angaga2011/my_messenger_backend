const { getDB } = require('../config/db');
const { verifyToken } = require('../utils/jwtUtils'); // Import the verifyToken function

exports.addContact = async (req, res) => {
    const { contacts } = req.body; // `contacts` is the array of new contact emails.
    const db = getDB();

    try {
        // Extract the JWT from the cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        // Verify the JWT and extract the user's email
        const decoded = verifyToken(token);
        const userEmail = decoded.email;

        // Validate if all provided contacts exist in the `user` collection
        const validContacts = [];
        for (const contactEmail of contacts || []) {
            const user = await db.collection('user').findOne({ email: contactEmail });
            if (!user) {
                return res.status(400).json({ message: `User with email ${contactEmail} does not exist` });
            }
            validContacts.push(contactEmail); // Only add valid emails
        }

        // Check if the user already has a record in the `user_contacts` collection
        const userContactsRecord = await db.collection('user_contacts').findOne({ email: userEmail });

        if (userContactsRecord) {
            // User exists, update the `contacts` array to include the valid new ones (avoiding duplicates)
            const updatedContacts = [...new Set([...userContactsRecord.contacts, ...validContacts])];
            await db.collection('user_contacts').updateOne(
                { email: userEmail },
                { $set: { contacts: updatedContacts } }
            );
            res.status(200).json({ message: 'Contacts updated successfully' });
        } else {
            // User doesn't have a record, create one with the provided contacts
            await db.collection('user_contacts').insertOne({ email: userEmail, contacts: validContacts });
            res.status(201).json({ message: 'Contact record created successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserContacts = async (req, res) => {
    const db = getDB();

    try {
        // Extract the JWT from the cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        // Verify the JWT and extract the user's email
        const decoded = verifyToken(token);
        const userEmail = decoded.email;

        // Fetch the user's contacts from the database
        const userContactsRecord = await db.collection('user_contacts').findOne({ email: userEmail });

        if (!userContactsRecord) {
            return res.status(404).json({ message: 'No contacts found for the user' });
        }

        res.status(200).json(userContactsRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};