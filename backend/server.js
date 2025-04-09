const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        // Start server only after successful DB connection
        const server = app.listen(PORT, '0.0.0.0', () => { // Listen on all network interfaces
            console.log('\n=================================');
            console.log('✅ MongoDB Connected Successfully');
            console.log('🚀 Server is running');
            console.log(`🔥 Server listening on http://localhost:${PORT}`);
            console.log('=================================\n');
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://to-do-task-lilac.vercel.app',
    'https://to-do-task.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})); 