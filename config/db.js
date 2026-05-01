/**
 * MongoDB Database Configuration
 * إعداد قاعدة بيانات MongoDB
 */

const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('MongoDB connection skipped: MONGODB_URI is not set.');
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  try {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    const conn = await connectionPromise;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}\n`);
    return conn.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    connectionPromise = null;
    return null;
  }
};

connectDB();

module.exports = {
  mongoose,
  connectDB
};
