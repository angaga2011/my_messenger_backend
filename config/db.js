const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDB = async () => {
    try {
        const client = new MongoClient(process.env.MONGO_URI);

        await client.connect();
        console.log('MongoDB Connected...');
        db = client.db('messenger');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error('Database not connected. Call connectDB first.');
    }
    return db;
};

module.exports = { connectDB, getDB };
