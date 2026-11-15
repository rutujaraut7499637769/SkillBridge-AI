require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!adminName || !adminEmail || !adminPassword || !mongoURI) {
      throw new Error(
        "Please set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD and MONGO_URI in .env"
      );
    }

    if (adminPassword.length < 8) {
      throw new Error("Admin password must be at least 8 characters long.");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected.");

    const existingUser = await User.findOne({ email: adminEmail });

    console.log("Admin account:", existingUser ? existingUser.email : "NOT FOUND");
    console.log("Admin role:", existingUser ? existingUser.role : "N/A");

    if (existingUser) {
      const passwordMatches = await bcrypt.compare(
        adminPassword,
        existingUser.password
      );

      if (!passwordMatches) {
        throw new Error(
          "This email already exists. Enter the correct account password to promote it."
        );
      }

      existingUser.role = "admin";
      await existingUser.save();

      console.log("Existing account successfully promoted to admin.");
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        accountType: "Student"
      });

      console.log("New admin account created successfully.");
    }
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

createAdmin();