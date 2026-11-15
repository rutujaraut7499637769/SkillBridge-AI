require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const User = require("./models/User");
const AssessmentResult = require("./models/AssessmentResult");
const QuizResult = require("./models/QuizResult");
const LearningActivity = require("./models/LearningActivity");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Upload folder
const uploadDirectory = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

app.use("/uploads", express.static(uploadDirectory));

// JWT secret
const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }
  return process.env.JWT_SECRET;
};

// MongoDB connection
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/skillbridge";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((error) =>
    console.error("MongoDB Connection Error:", error)
  );

// Authentication middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token required"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, getJwtSecret());

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please login again."
    });
  }
};

// Admin authorization
const verifyAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.userId);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        message: "Admin access denied"
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    res.status(500).json({
      message: "Admin authorization failed"
    });
  }
};

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const fileName =
      "profile-" + req.user.userId + "-" + Date.now() + extension;

    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }
  }
});

// Delete old profile image
const deleteProfileImage = (imagePath) => {
  if (!imagePath || !imagePath.startsWith("/uploads/")) return;

  const fileName = path.basename(imagePath);
  const filePath = path.join(uploadDirectory, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Record learning activity
const recordLearningActivity = async (userId) => {
  try {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    });

    await LearningActivity.findOneAndUpdate(
      { userId, date: today },
      { $setOnInsert: { userId, date: today } },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Learning activity error:", error);
  }
};

// Home route
app.get("/", (req, res) => {
  res.send("SkillBridge AI Backend is Running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "SkillBridge AI API is working",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected"
  });
});

// ================= AUTH ROUTES =================

// User signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    res.status(500).json({
      message: "Registration failed"
    });
  }
});

// User login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role || "user"
      },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      message: "Login successful",
      token,
      user: safeUser
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed"
    });
  }
});

// ================= ADMIN LOGIN =================

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const admin = await User.findOne({
      email: email.trim().toLowerCase(),
      role: "admin"
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin credentials"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid admin credentials"
      });
    }

    const token = jwt.sign(
      {
        userId: admin._id,
        role: "admin"
      },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    const safeAdmin = admin.toObject();
    delete safeAdmin.password;

    res.json({
      message: "Admin login successful",
      token,
      user: safeAdmin
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      message: "Admin login failed"
    });
  }
});

// ================= PROFILE ROUTES =================

// Get profile
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Profile fetched successfully",
      user
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      message: "Failed to fetch profile"
    });
  }
});

// Update profile
app.put("/api/profile", verifyToken, async (req, res) => {
  try {
    const { name, email, accountType } = req.body;

    if (!name || !email || !accountType) {
      return res.status(400).json({
        message: "Name, email and account type are required"
      });
    }

    const allowedAccountTypes = [
      "Student",
      "Instructor",
      "Learner"
    ];

    if (!allowedAccountTypes.includes(accountType)) {
      return res.status(400).json({
        message: "Invalid account type"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
      _id: { $ne: req.user.userId }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name: name.trim(),
        email: cleanEmail,
        accountType
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Failed to update profile"
    });
  }
});

// Upload profile photo
app.post(
  "/api/profile/photo",
  verifyToken,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select an image"
        });
      }

      const user = await User.findById(req.user.userId);

      if (!user) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({
          message: "User not found"
        });
      }

      deleteProfileImage(user.profileImage);

      user.profileImage = "/uploads/" + req.file.filename;
      await user.save();

      res.json({
        message: "Profile photo updated successfully",
        profileImage: user.profileImage
      });
    } catch (error) {
      console.error("Profile photo upload error:", error);
      res.status(500).json({
        message: error.message || "Failed to upload profile photo"
      });
    }
  }
);

// Delete profile photo
app.delete("/api/profile/photo", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    deleteProfileImage(user.profileImage);

    user.profileImage = "";
    await user.save();

    res.json({
      message: "Profile photo removed successfully",
      profileImage: ""
    });
  } catch (error) {
    console.error("Remove profile photo error:", error);
    res.status(500).json({
      message: "Failed to remove profile photo"
    });
  }
});
// ================= ASSESSMENT ROUTES =================

// Save assessment result
app.post("/api/assessment", verifyToken, async (req, res) => {
  try {
    const { skill, answers, score, percentage, level } = req.body;

    if (
      !skill ||
      score === undefined ||
      percentage === undefined ||
      !level
    ) {
      return res.status(400).json({
        message: "Required assessment fields are missing"
      });
    }

    const result = await AssessmentResult.create({
      userId: req.user.userId,
      skill,
      answers,
      score,
      percentage,
      level
    });

    await recordLearningActivity(req.user.userId);

    res.status(201).json({
      message: "Assessment result saved successfully",
      result
    });
  } catch (error) {
    console.error("Assessment save error:", error);
    res.status(500).json({
      message: "Failed to save assessment result"
    });
  }
});

// Get latest assessment
app.get("/api/assessment/latest", verifyToken, async (req, res) => {
  try {
    const result = await AssessmentResult.findOne({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    if (!result) {
      return res.status(404).json({
        message: "No assessment result found"
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Latest assessment error:", error);
    res.status(500).json({
      message: "Failed to fetch assessment"
    });
  }
});

// Get all assessments
app.get("/api/assessment/all", verifyToken, async (req, res) => {
  try {
    const results = await AssessmentResult.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error("Assessment history error:", error);
    res.status(500).json({
      message: "Failed to fetch assessment history"
    });
  }
});

// ================= QUIZ ROUTES =================

// Save quiz result
app.post("/api/quiz/result", verifyToken, async (req, res) => {
  try {
    const {
      skill,
      score,
      totalQuestions,
      percentage,
      level,
      weakTopics,
      strongTopics
    } = req.body;

    if (
      !skill ||
      score === undefined ||
      !totalQuestions ||
      percentage === undefined ||
      !level
    ) {
      return res.status(400).json({
        message: "All quiz result fields are required"
      });
    }

    const quizResult = await QuizResult.create({
      userId: req.user.userId,
      skill,
      score,
      totalQuestions,
      percentage,
      level,
      weakTopics: weakTopics || [],
      strongTopics: strongTopics || []
    });

    await recordLearningActivity(req.user.userId);

    res.status(201).json({
      message: "Quiz result saved successfully",
      result: quizResult
    });
  } catch (error) {
    console.error("Quiz result error:", error);
    res.status(500).json({
      message: "Failed to save quiz result"
    });
  }
});

// Get quiz results
app.get("/api/quiz/results", verifyToken, async (req, res) => {
  try {
    const results = await QuizResult.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error("Quiz results error:", error);
    res.status(500).json({
      message: "Failed to fetch quiz results"
    });
  }
});

// ================= LEARNING ACTIVITY =================

// Get learning streak
app.get("/api/activity/streak", verifyToken, async (req, res) => {
  try {
    const activities = await LearningActivity.find({
      userId: req.user.userId
    }).sort({ date: -1 });

    const uniqueDates = [
      ...new Set(activities.map((activity) => activity.date))
    ];

    if (uniqueDates.length === 0) {
      return res.json({
        currentStreak: 0,
        longestStreak: 0,
        activityDates: []
      });
    }

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    });

    const dateToUTC = (date) =>
      new Date(date + "T00:00:00.000Z");

    let currentStreak = 0;
    let checkDate = dateToUTC(today);

    while (true) {
      const dateString = checkDate.toISOString().slice(0, 10);

      if (uniqueDates.includes(dateString)) {
        currentStreak++;
        checkDate.setUTCDate(checkDate.getUTCDate() - 1);
      } else {
        break;
      }
    }

    const sortedDates = [...uniqueDates].sort();

    let longestStreak = 1;
    let currentLongest = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const previousDate = dateToUTC(sortedDates[i - 1]);
      const currentDate = dateToUTC(sortedDates[i]);

      const difference =
        (currentDate - previousDate) / (1000 * 60 * 60 * 24);

      if (difference === 1) {
        currentLongest++;
        longestStreak = Math.max(
          longestStreak,
          currentLongest
        );
      } else {
        currentLongest = 1;
      }
    }

    res.json({
      currentStreak,
      longestStreak,
      activityDates: uniqueDates
    });
  } catch (error) {
    console.error("Streak error:", error);
    res.status(500).json({
      message: "Failed to calculate learning streak"
    });
  }
});
// ================= ADMIN DASHBOARD =================

// Admin dashboard statistics
app.get(
  "/api/admin/dashboard",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const [
        totalUsers,
        totalAdmins,
        totalAssessments,
        totalQuizzes,
        recentUsers,
        recentAssessments
      ] = await Promise.all([
        User.countDocuments({ role: { $ne: "admin" } }),
        User.countDocuments({ role: "admin" }),
        AssessmentResult.countDocuments(),
        QuizResult.countDocuments(),

        User.find({ role: { $ne: "admin" } })
          .select("-password")
          .sort({ createdAt: -1 })
          .limit(5),

        AssessmentResult.find()
          .populate("userId", "name email")
          .sort({ createdAt: -1 })
          .limit(5)
      ]);

      res.json({
        message: "Admin dashboard data fetched successfully",
        statistics: {
          totalUsers,
          totalAdmins,
          totalAssessments,
          totalQuizzes
        },
        recentUsers,
        recentAssessments
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);
      res.status(500).json({
        message: "Failed to load admin dashboard"
      });
    }
  }
);

// Get all users with search and pagination
app.get(
  "/api/admin/users",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit) || 10)
      );

      const search = (req.query.search || "").trim();

      const filter = {
        role: { $ne: "admin" }
      };

      if (search) {
        const safeSearch = search.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

        filter.$or = [
          { name: { $regex: safeSearch, $options: "i" } },
          { email: { $regex: safeSearch, $options: "i" } }
        ];
      }

      const [users, totalUsers] = await Promise.all([
        User.find(filter)
          .select("-password")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),

        User.countDocuments(filter)
      ]);

      res.json({
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          limit
        }
      });
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({
        message: "Failed to fetch users"
      });
    }
  }
);

// Get all assessment records for admin
app.get(
  "/api/admin/assessments",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const assessments = await AssessmentResult.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(200);

      res.json({
        total: assessments.length,
        assessments
      });
    } catch (error) {
      console.error("Admin assessments error:", error);
      res.status(500).json({
        message: "Failed to fetch assessments"
      });
    }
  }
);

// Get all quiz records for admin
app.get(
  "/api/admin/quizzes",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const quizzes = await QuizResult.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(200);

      res.json({
        total: quizzes.length,
        quizzes
      });
    } catch (error) {
      console.error("Admin quizzes error:", error);
      res.status(500).json({
        message: "Failed to fetch quiz results"
      });
    }
  }
);

// Delete a user from admin dashboard
app.delete(
  "/api/admin/users/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "Invalid user ID"
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      if (user.role === "admin") {
        return res.status(403).json({
          message: "Admin accounts cannot be deleted here"
        });
      }

      deleteProfileImage(user.profileImage);

      await Promise.all([
        AssessmentResult.deleteMany({ userId: user._id }),
        QuizResult.deleteMany({ userId: user._id }),
        LearningActivity.deleteMany({ userId: user._id }),
        User.findByIdAndDelete(user._id)
      ]);

      res.json({
        message: "User and related records deleted successfully"
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        message: "Failed to delete user"
      });
    }
  }
);

// ================= SERVER START =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SkillBridge AI Server running on port ${PORT}`);
});