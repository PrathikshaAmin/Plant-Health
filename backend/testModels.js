// this here now is just to check if its running-- will hv to remove this later

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// Import all models to confirm they load without errors
const User = require("./models/User");
const Disease = require("./models/Disease");
const Symptom = require("./models/Symptom");
const Treatment = require("./models/Treatment");
const DiagnosisRule = require("./models/DiagnosisRule");
const DiagnosisHistory = require("./models/DiagnosisHistory");
const UploadedImage = require("./models/UploadedImage");

const run = async () => {
  await connectDB();
  console.log("All models loaded successfully:");
  console.log("- User:", !!User);
  console.log("- Disease:", !!Disease);
  console.log("- Symptom:", !!Symptom);
  console.log("- Treatment:", !!Treatment);
  console.log("- DiagnosisRule:", !!DiagnosisRule);
  console.log("- DiagnosisHistory:", !!DiagnosisHistory);
  console.log("- UploadedImage:", !!UploadedImage);
  mongoose.connection.close();
};

run();
