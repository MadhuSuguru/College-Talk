const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongo Connected`);
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

module.exports = connectDB;