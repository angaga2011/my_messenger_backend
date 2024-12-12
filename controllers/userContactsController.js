const { getDB } = require('../config/db');

// Add Contact function
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

// Get User Contacts function
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

        // Fetch usernames for each contact
        const contactsWithUsernames = await Promise.all(
            userContactsRecord.contacts.map(async (contactEmail) => {
                const user = await db.collection('user').findOne({ email: contactEmail });
                return {
                    email: contactEmail,
                    username: user ? user.username : null,
                };
            })
        );

        res.status(200).json({ contacts: contactsWithUsernames });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Contact function
exports.deleteContact = async (req, res) => {
    const { contactEmail } = req.body; // `contactEmail` is the email of the contact to be deleted.
    const db = getDB();

    try {
        // Access the user's email from the token
        const userEmail = req.user.email;

        // Remove the contact from the user's contacts
        const userContactsRecord = await db.collection('user_contacts').findOne({ email: userEmail });

        if (!userContactsRecord) {
            return res.status(404).json({ message: 'No contacts found for the user' });
        }

        const updatedContacts = userContactsRecord.contacts.filter(email => email !== contactEmail);
        await db.collection('user_contacts').updateOne(
            { email: userEmail },
            { $set: { contacts: updatedContacts } }
        );

        // Remove the user from the contact's contacts
        const contactRecord = await db.collection('user_contacts').findOne({ email: contactEmail });

        if (contactRecord) {
            const updatedContactContacts = contactRecord.contacts.filter(email => email !== userEmail);
            await db.collection('user_contacts').updateOne(
                { email: contactEmail },
                { $set: { contacts: updatedContactContacts } }
            );
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};