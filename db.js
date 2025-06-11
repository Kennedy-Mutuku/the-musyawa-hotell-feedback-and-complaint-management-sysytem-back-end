const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_db';

  try {
    console.log('🔗 Connecting to MongoDB at:', mongoURI);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // no longer needed in mongoose 6+
      // useFindAndModify: false, // no longer needed in mongoose 6+
    });

    console.log('✅ MongoDB connected successfully');

    // Optional: listen for mongoose connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
