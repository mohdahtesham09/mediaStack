const mongoose = require('mongoose')
const conncetDB = async() =>{
    try {
         await mongoose.connect(process.env.MONGO_URI)
         console.log("Connect successfully to MongoDB 🟢")
    } catch (error) {
        console.log("Connection to MongoDB failed ❌", error.message)
    }
};

module.exports = conncetDB;
