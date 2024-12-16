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

// Keep the database connection logic into a separate file called db.js. This file will contain the connectDB function to connect to the MongoDB database and the getDB function to retrieve the database instance.
// The connectDB function will use the MONGO_URI environment variable to establish a connection to the MongoDB database. The getDB function will return the database instance if it exists, or throw an error if the database is not connected.
// The db.js file will also load environment variables using dotenv.