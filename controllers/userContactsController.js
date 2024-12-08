const { getDB } = require('../config/db');

exports.addContact = async (req, res) => {
    const { contacts } = req.body; // `contacts` is the array of new contact emails.
    const db = getDB();

    try {
        // Access the user's email from the token
        const userEmail = req.user.email;

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
        } else {
            // User doesn't have a record, create one with the provided contacts
            await db.collection('user_contacts').insertOne({ email: userEmail, contacts: validContacts });
        }

        // Update each valid contact's record to include the user's email
        for (const contactEmail of validContacts) {
            const contactRecord = await db.collection('user_contacts').findOne({ email: contactEmail });

            if (contactRecord) {
                // Contact exists, update their `contacts` array to include the user's email (avoiding duplicates)
                const updatedContacts = [...new Set([...contactRecord.contacts, userEmail])];
                await db.collection('user_contacts').updateOne(
                    { email: contactEmail },
                    { $set: { contacts: updatedContacts } }
                );
            } else {
                // Contact doesn't have a record, create one with the user's email
                await db.collection('user_contacts').insertOne({ email: contactEmail, contacts: [userEmail] });
            }
        }

        res.status(200).json({ message: 'Contacts updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserContacts = async (req, res) => {
    const db = getDB();

    try {
        // Access the user's email from the token
        const userEmail = req.user.email;
        console.log('User email:', userEmail);

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