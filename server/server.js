require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const AssessmentResult = require("./models/AssessmentResult");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/skillbridge")
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });

app.get("/", (req, res) => {
  res.send("SkillBridge AI Backend is Running!");
});

app.get("/test-user", async (req, res) => {
  try {
    const user = await User.create({
      name: "Test Student",
      email: "test@skillbridge.com",
      password: "123456"
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

const authMiddleware = require("./middleware/authMiddleware");

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    res.json({
      message: "Protected profile accessed successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.post("/assessment", authMiddleware, async (req, res) => {
  try {
    const {
      skill,
      answers,
      score,
      percentage,
      level
    } = req.body;

    const result = await AssessmentResult.create({
      userId: req.user.userId,
      skill,
      answers,
      score,
      percentage,
      level
    });

    res.status(201).json({
      message: "Assessment result saved successfully",
      result
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// Get latest assessment result for logged-in user
app.get("/assessment/latest", authMiddleware, async (req, res) => {
  try {
    const result = await AssessmentResult.findOne({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    if (!result) {
      return res.status(404).json({
        message: "No assessment result found"
      });
    }

    res.status(200).json(result);

  } catch (error) {
    console.log("Error fetching latest assessment:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

// Get all assessment results for logged-in user
app.get("/assessment/all", authMiddleware, async (req, res) => {
  try {
    const results = await AssessmentResult.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json(results);

  } catch (error) {
    console.log("Error fetching assessment results:", error);

    res.status(500).json({
      message: error.message
    });
  }
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});