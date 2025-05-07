// handles mongodb connection setup and teardown

// ───── DEPENDENCIES ─────
const { MongoClient } = require('mongodb');
require('dotenv').config();

// ───── GLOBAL STATE ─────
let db = null;
let client = null;

// ───── CONNECT TO MONGODB ─────
// Initializes MongoDB connection using environment variable
async function connectToMongo() {
  try {
    // Debug: Check if environment variable is loaded
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    console.log('Attempting to connect to MongoDB...');
    client = new MongoClient(process.env.MONGO_URI);
    
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    db = client.db('becomejsmaster');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// ───── GET DATABASE INSTANCE ─────
// Returns the initialized MongoDB database object
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongo() first.');
  }
  return db;
}

// ───── CLOSE CONNECTION ─────
// Gracefully closes the MongoDB client
async function closeConnection() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// ───── EXPORTS ─────
module.exports = {
  connectToMongo,
  getDb,
  closeConnection
};
