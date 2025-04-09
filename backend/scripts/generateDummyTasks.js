const mongoose = require('mongoose');
const Todo = require('../models/todo.model');
require('dotenv').config();

const categories = ['work', 'personal', 'shopping', 'health', 'other'];
const statuses = ['pending', 'in_progress', 'completed'];

const generateDummyTasks = async (userId) => {
    try {
        // Check if MongoDB URI is set
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not set in environment variables');
        }

        // Check if already connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
        }

        const tasks = [];
        const today = new Date();

        // Generate more realistic task titles and descriptions
        const taskTitles = [
            'Complete project documentation',
            'Schedule team meeting',
            'Review pull requests',
            'Update project dependencies',
            'Prepare presentation slides',
            'Grocery shopping',
            'Pay monthly bills',
            'Call family members',
            'Book doctor appointment',
            'Exercise routine',
            'Read new book',
            'Plan weekend trip',
            'Clean the house',
            'Organize workspace',
            'Update resume',
            'Learn new skill',
            'Write blog post',
            'Backup important files',
            'Plan birthday party',
            'Renew subscriptions'
        ];

        const taskDescriptions = [
            'Make sure to include all necessary sections and examples',
            'Coordinate with team members for availability',
            'Check for any potential issues or improvements',
            'Update to latest stable versions',
            'Include key points and visual aids',
            'Don\'t forget to buy fruits and vegetables',
            'Set up automatic payments if possible',
            'Catch up with family members',
            'Check for available slots next week',
            '30 minutes of cardio and strength training',
            'Read at least 50 pages',
            'Research destinations and activities',
            'Focus on kitchen and bathroom',
            'Declutter and organize files',
            'Add recent projects and achievements',
            'Dedicate 1 hour daily to learning',
            'Write about recent project experience',
            'Use cloud storage for important documents',
            'Send out invitations and plan activities',
            'Check all active subscriptions'
        ];

        for (let i = 0; i < 20; i++) {
            // Generate random due date within next 30 days
            const dueDate = new Date(today);
            dueDate.setDate(today.getDate() + Math.floor(Math.random() * 30));

            const task = {
                title: taskTitles[i],
                description: taskDescriptions[i],
                category: categories[Math.floor(Math.random() * categories.length)],
                dueDate: dueDate,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                user: userId,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            tasks.push(task);
        }

        // Insert all tasks
        await Todo.insertMany(tasks);
        console.log('Successfully generated 20 dummy tasks');

    } catch (error) {
        console.error('Error generating dummy tasks:', error.message);
        if (error.name === 'MongooseServerSelectionError') {
            console.error('MongoDB connection error. Please make sure MongoDB is running and the connection string is correct.');
        }
        throw error;
    }
};

// Export the function
module.exports = generateDummyTasks; 