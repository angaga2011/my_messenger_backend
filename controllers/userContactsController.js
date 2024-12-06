const { getDB } = require('../config/db');
// const { ObjectId } = require('mongodb');

exports.addContact = async (req, res) => {
    const { email, contacts } = req.body; // `email` is the user's email, `contacts` is the array of new contact emails.
    const db = getDB();

    try {
        // Ensure all provided contact emails exist in the `user` collection
        const allUsersExist = await Promise.all(
            contacts.map(async (contactEmail) => {
                const user = await db.collection('user').findOne({ email: contactEmail });
                return !!user;
            })
        );

        if (allUsersExist.includes(false)) {
            return res.status(400).json({ message: 'One or more contact emails do not exist' });
        }

        // Check if the user already has a record in the `user_contacts` collection
        const userContactsRecord = await db.collection('user_contacts').findOne({ email });

        if (userContactsRecord) {
            // User exists, update the `contacts` array to include the new ones (avoiding duplicates)
            const updatedContacts = [...new Set([...userContactsRecord.contacts, ...contacts])];
            await db.collection('user_contacts').updateOne(
                { email },
                { $set: { contacts: updatedContacts } }
            );
            res.status(200).json({ message: 'Contacts updated successfully' });
        } else {
            // User doesn't have a record, create one with the provided contacts
            await db.collection('user_contacts').insertOne({ email, contacts });
            res.status(201).json({ message: 'Contact record created successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
