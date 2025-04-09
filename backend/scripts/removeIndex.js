const mongoose = require('mongoose');
require('dotenv').config();

const removeIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Drop the existing index
        const collections = await mongoose.connection.db.collections();
        const usersCollection = collections.find(c => c.collectionName === 'users');
        if (usersCollection) {
            await usersCollection.dropIndex('username_1');
            console.log('Successfully removed username index');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

removeIndex(); 