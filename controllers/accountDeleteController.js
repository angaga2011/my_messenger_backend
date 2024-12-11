const { getDB } = require('../config/db');

exports.deleteUserAccount = async (req, res) => {
    const db = getDB();

    try {
        // Access the user's email from the token
        const userEmail = req.user.email;

        // Delete the user's account
        const result = await db.collection('user').deleteOne({ email: userEmail });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally: Remove the user's contacts and messages
        await db.collection('user_contacts').deleteOne({ email: userEmail });
        await db.collection('messages').deleteMany({
            $or: [{ sender: userEmail }, { receiver: userEmail }],
        });

        res.status(200).json({ message: 'User account and associated data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteContact = async (req, res) => {
    const db = getDB();
    const { contactEmail } = req.body; // Email of the contact to be removed

    try {
        // Access the user's email from the token
        const userEmail = req.user.email;

        // Fetch the user's current contacts
        const userContactsRecord = await db.collection('user_contacts').findOne({ email: userEmail });
        if (!userContactsRecord) {
            return res.status(404).json({ message: 'User contacts not found' });
        }

        // Remove the contact from the user's contacts
        const updatedContacts = userContactsRecord.contacts.filter(email => email !== contactEmail);
        await db.collection('user_contacts').updateOne(
            { email: userEmail },
            { $set: { contacts: updatedContacts } }
        );

        // Optionally: Remove the user from the contact's contacts
        const contactRecord = await db.collection('user_contacts').findOne({ email: contactEmail });
        if (contactRecord) {
            const updatedContactList = contactRecord.contacts.filter(email => email !== userEmail);
            await db.collection('user_contacts').updateOne(
                { email: contactEmail },
                { $set: { contacts: updatedContactList } }
            );
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
