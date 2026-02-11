const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not set");
    }

    // Fail fast if DB is unavailable instead of buffering model operations.
    mongoose.set("bufferCommands", false);

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });
        return mongoose.connection;
    } catch (error) {
        console.error("Connection to MongoDB failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;
