const mongoose = require("mongoose");

// This function connects our app to MongoDB using the connection string
// stored in the .env file (so we never hardcode secrets in code).
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Stop the server if we can't connect to the DB
  }
};

module.exports = connectDB;
