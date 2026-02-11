const mongoose = require("mongoose");

// Disable Mongoose query buffering globally to avoid delayed timeout errors.
mongoose.set("bufferCommands", false);

const isDbConnected = () => mongoose.connection.readyState === 1;

let listenersAttached = false;
const attachConnectionListeners = () => {
    if (listenersAttached) return;
    listenersAttached = true;

    mongoose.connection.on("disconnected", () => {
        console.error("MongoDB disconnected");
    });

    mongoose.connection.on("error", (error) => {
        console.error("MongoDB runtime error:", error.message);
    });
};

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI?.trim();

    if (!mongoUri) {
        throw new Error(
            "Database configuration error: MONGO_URI is missing. Please set MONGO_URI in .env."
        );
    }

    if (isDbConnected()) {
        return mongoose.connection;
    }

    attachConnectionListeners();

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
module.exports.isDbConnected = isDbConnected;
