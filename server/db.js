const { MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;
let client = null;

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

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongo() first.');
  }
  return db;
}

async function closeConnection() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

module.exports = {
  connectToMongo,
  getDb,
  closeConnection
}; 