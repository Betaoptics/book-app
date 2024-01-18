const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // console.log(process.env.DATABASE_URL);
        await mongoose.connect(process.env.DATABASE_URL || process.env.GUEST_URL);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;