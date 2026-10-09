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
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "uploads")
    );
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const fileName =
      "profile-" +
      req.user.userId +
      "-" +
      Date.now() +
      extension;

    cb(null, fileName);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG and WEBP images are allowed"
        )
      );
    }
  }
});

// MongoDB Connection (Live Cloud DB OR Local fallback)
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/skillbridge";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log(
      "MongoDB Connected Successfully!"
    );
  })
  .catch((error) => {
    console.log(
      "MongoDB Connection Error:",
      error
    );
  });

app.get("/", (req, res) => {
  res.send(
    "SkillBridge AI Backend is Running!"
  );
});

app.get(
  "/test-user",
  async (req, res) => {
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
  }
);

app.post(
  "/api/auth/signup",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password
      } = req.body;

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name,
          email,
          password: hashedPassword
        });

      res.status(201).json({
        message:
          "User registered successfully",
        user
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message:
            "Invalid password"
        });
      }

      const token =
        jwt.sign(
          {
            userId: user._id
          },
          process.env.JWT_SECRET || "fallback_secret",
          {
            expiresIn: "1h"
          }
        );

      res.json({
        message:
          "Login successful",
        token
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.userId
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      res.json({
        message:
          "Protected profile accessed successfully",
        user
      });

    } catch (error) {
      console.error(
        "Profile error:",
        error
      );

      res.status(500).json({
        message: error.message
      });
    }
  }
);

app.put(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        email,
        accountType
      } = req.body;

      if (
        !name ||
        !email ||
        !accountType
      ) {
        return res.status(400).json({
          message:
            "Name, email and account type are required"
        });
      }

      const allowedAccountTypes = [
        "Student",
        "Instructor",
        "Learner"
      ];

      if (
        !allowedAccountTypes.includes(
          accountType
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid account type"
        });
      }

      const existingUser =
        await User.findOne({
          email: email.trim(),
          _id: {
            $ne: req.user.userId
          }
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "Email is already registered"
        });
      }

      const updatedUser =
        await User.findByIdAndUpdate(
          req.user.userId,
          {
            name: name.trim(),
            email: email.trim(),
            accountType
          },
          {
            new: true,
            runValidators: true
          }
        ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      res.status(200).json({
        message:
          "Profile updated successfully",
        user: updatedUser
      });

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update profile"
      });
    }
  }
);

app.post(
  "/profile/photo",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "Please select an image"
        });
      }

      const user =
        await User.findById(
          req.user.userId
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      if (user.profileImage) {
        const oldFilePath =
          path.join(
            __dirname,
            user.profileImage.replace(
              "/uploads/",
              ""
            )
          );

        if (
          fs.existsSync(
            oldFilePath
          )
        ) {
          fs.unlinkSync(
            oldFilePath
          );
        }
      }

      user.profileImage =
        "/uploads/" +
        req.file.filename;

      await user.save();

      res.status(200).json({
        message:
          "Profile photo updated successfully",
        profileImage:
          user.profileImage
      });

    } catch (error) {
      console.error(
        "Profile photo upload error:",
        error
      );

      res.status(500).json({
        message:
          error.message ||
          "Failed to upload profile photo"
      });
    }
  }
);

app.delete(
  "/profile/photo",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.userId
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      if (user.profileImage) {
        const filePath =
          path.join(
            __dirname,
            user.profileImage.replace(
              "/uploads/",
              ""
            )
          );

        if (
          fs.existsSync(
            filePath
          )
        ) {
          fs.unlinkSync(
            filePath
          );
        }
      }

      user.profileImage = "";

      await user.save();

      res.status(200).json({
        message:
          "Profile photo removed successfully",
        profileImage: ""
      });

    } catch (error) {
      console.error(
        "Remove profile photo error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to remove profile photo"
      });
    }
  }
);

const recordLearningActivity =
  async (userId) => {
    try {
      const today =
        new Date().toLocaleDateString(
          "en-CA",
          {
            timeZone:
              "Asia/Kolkata"
          }
        );

      await LearningActivity.findOneAndUpdate(
        {
          userId,
          date: today
        },
        {
          userId,
          date: today
        },
        {
          upsert: true,
          new: true
        }
      );

    } catch (error) {
      console.error(
        "Learning activity error:",
        error
      );
    }
  };

app.post(
  "/assessment",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        skill,
        answers,
        score,
        percentage,
        level
      } = req.body;

      const result =
        await AssessmentResult.create({
          userId:
            req.user.userId,
          skill,
          answers,
          score,
          percentage,
          level
        });

      await recordLearningActivity(
        req.user.userId
      );

      res.status(201).json({
        message:
          "Assessment result saved successfully",
        result
      });

    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  }
);

app.post(
  "/quiz/result",
  authMiddleware,
  async (req, res) => {
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
          message:
            "All quiz result fields are required"
        });
      }

      const quizResult =
        new QuizResult({
          userId:
            req.user.userId,
          skill,
          score,
          totalQuestions,
          percentage,
          level,
          weakTopics:
            weakTopics || [],
          strongTopics:
            strongTopics || []
        });

      await quizResult.save();

      await recordLearningActivity(
        req.user.userId
      );

      res.status(201).json({
        message:
          "Quiz result saved successfully",
        result: quizResult
      });

    } catch (error) {
      console.error(
        "Quiz result error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to save quiz result"
      });
    }
  }
);

app.get(
  "/assessment/latest",
  authMiddleware,
  async (req, res) => {
    try {
      const result =
        await AssessmentResult.findOne({
          userId:
            req.user.userId
        }).sort({
          createdAt: -1
        });

      if (!result) {
        return res.status(404).json({
          message:
            "No assessment result found"
        });
      }

      res.status(200).json(
        result
      );

    } catch (error) {
      console.log(
        "Error fetching latest assessment:",
        error
      );

      res.status(500).json({
        message:
          error.message
      });
    }
  }
);

app.get(
  "/assessment/all",
  authMiddleware,
  async (req, res) => {
    try {
      const results =
        await AssessmentResult.find({
          userId:
            req.user.userId
        }).sort({
          createdAt: -1
        });

      res.status(200).json(
        results
      );

    } catch (error) {
      console.log(
        "Error fetching assessment results:",
        error
      );

      res.status(500).json({
        message:
          error.message
      });
    }
  }
);

app.get(
  "/quiz/results",
  authMiddleware,
  async (req, res) => {
    try {
      const results =
        await QuizResult.find({
          userId:
            req.user.userId
        }).sort({
          createdAt: -1
        });

      res.status(200).json(
        results
      );

    } catch (error) {
      console.log(
        "Error fetching quiz results:",
        error
      );

      res.status(500).json({
        message:
          error.message
      });
    }
  }
);

app.get(
  "/activity/streak",
  authMiddleware,
  async (req, res) => {
    try {
      const activities =
        await LearningActivity.find({
          userId:
            req.user.userId
        }).sort({
          date: -1
        });

      const dates =
        activities.map(
          (activity) =>
            activity.date
        );

      if (
        dates.length === 0
      ) {
        return res.json({
          currentStreak: 0,
          longestStreak: 0,
          activityDates: []
        });
      }

      const uniqueDates = [
        ...new Set(dates)
      ];

      const today =
        new Date().toLocaleDateString(
          "en-CA",
          {
            timeZone:
              "Asia/Kolkata"
          }
        );

      let currentStreak = 0;

      let checkDate =
        new Date(today);

      while (true) {
        const dateString =
          checkDate.toLocaleDateString(
            "en-CA",
            {
              timeZone:
                "Asia/Kolkata"
            }
          );

        if (
          uniqueDates.includes(
            dateString
          )
        ) {
          currentStreak++;

          checkDate.setDate(
            checkDate.getDate() - 1
          );
        } else {
          break;
        }
      }

      const sortedDates =
        [...uniqueDates].sort();

      let longestStreak = 1;
      let currentLongest = 1;

      for (
        let i = 1;
        i < sortedDates.length;
        i++
      ) {
        const previousDate =
          new Date(
            sortedDates[i - 1]
          );

        const currentDate =
          new Date(
            sortedDates[i]
          );

        const difference =
          (
            currentDate -
            previousDate
          ) /
          (
            1000 *
            60 *
            60 *
            24
          );

        if (
          difference === 1
        ) {
          currentLongest++;

          longestStreak =
            Math.max(
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
        activityDates:
          uniqueDates
      });

    } catch (error) {
      console.error(
        "Streak error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to calculate streak"
      });
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});