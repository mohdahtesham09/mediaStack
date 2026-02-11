const mongoose = require('mongoose')
const conncetDB = async() =>{
    try {
         await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.error("Connection to MongoDB failed", error.message)
    }
};

module.exports = conncetDB;
