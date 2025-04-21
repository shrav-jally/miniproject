const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        
        console.log('MongoDB Connected:', conn.connection.host);
        
        // Handle connection errors after initial connection
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        // Exit with failure if initial connection fails
        process.exit(1);
    }
};

module.exports = { db: connectDB };
