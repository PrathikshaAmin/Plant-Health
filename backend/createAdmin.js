/**
 * createAdmin.js
 *
 * Creates (or promotes) exactly one admin account. This is the only way an
 * account gets isAdmin: true — registering through the app never does.
 * Running it again on the same email also resets that account's password
 * to whatever you pass in, so you can use this to recover a forgotten
 * admin password too.
 *
 * Usage:
 *   node createAdmin.js <email> <password> [name] [mobileNumber]
 *
 * Examples:
 *   # promote an account that already registered through the app
 *   # (also resets its password to the one you give here)
 *   node createAdmin.js admin@planthealth.com mypassword123
 *
 *   # create a brand new admin account from scratch
 *   node createAdmin.js admin@planthealth.com mypassword123 "Admin" "9999999999"
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

async function createAdmin() {
  const [, , email, password, name, mobileNumber] = process.argv;

  if (!email || !password) {
    console.error(
      "Usage: node createAdmin.js <email> <password> [name] [mobileNumber]",
    );
    process.exit(1);
  }

  await connectDB();

  let user = await User.findOne({ email });

  if (user) {
    user.isAdmin = true;
    user.password = password; // pre-save hook re-hashes this automatically
    await user.save();
    console.log(
      `Existing user ${email} promoted to admin and password updated.`,
    );
  } else {
    if (!name || !mobileNumber) {
      console.error(
        "No existing user with that email — creating a new one requires name and mobileNumber too.",
      );
      console.error(
        "Usage: node createAdmin.js <email> <password> <name> <mobileNumber>",
      );
      process.exit(1);
    }
    user = await User.create({
      name,
      email,
      password, // hashed automatically by the User model's pre-save hook
      mobileNumber,
      isAdmin: true,
    });
    console.log(`New admin account created for ${email}.`);
  }

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error("Failed to create/promote admin:", err);
  process.exit(1);
});
