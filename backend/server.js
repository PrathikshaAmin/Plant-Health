// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allows the mobile app / admin portal (different origins) to call this API
app.use(express.json()); // Lets us read JSON data sent in requests (req.body)

// Simple test route to confirm the server is alive
app.get("/", (req, res) => {
  res.json({ message: "Plant Health API is running" });
});


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/diseases', require('./routes/diseaseRoutes'));
app.use("/api/symptoms", require("./routes/symptomRoutes"));
app.use('/api/treatments', require('./routes/treatmentRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
