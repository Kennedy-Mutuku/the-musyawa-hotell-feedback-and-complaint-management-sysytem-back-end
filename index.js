const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db');
const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Serve uploaded files statically from /uploads
    // Use absolute path to avoid any path issues
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Health check endpoint
    app.get('/', (req, res) => {
      res.status(200).json({ 
        success: true,
        message: '🎉 Feedback System API is running',
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/feedback', feedbackRoutes);
    app.use('/api/admin', adminRoutes);

    // 404 handler - must come after all routes
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found',
      });
    });

    // Global error handler - must come after all other middleware
    app.use((err, req, res, next) => {
      console.error('❌ Server error:', err.stack);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message }),
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
