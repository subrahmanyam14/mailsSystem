const mongoose = require("mongoose");

const connection = async( ) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to the mongo DB...");
    } catch (error) {
        console.log("error in the connection", error);
    }
}

module.exports = connection;