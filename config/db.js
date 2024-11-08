const mongoose = require("mongoose");
const colors = require("colors");
// require("dotenv").config();
const connectDB = async () => {
   try {
      const conn = await mongoose.connect(process.env.MONGODB_URL, {});
      console.log("MongoDB connected: " + conn.connection.host.green.underline);
   } catch (err) {
      console.error(`Error: ${err.message}`.red.underline.bold);
      process.exit(1);
   }
};

module.exports = connectDB;
