const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    profileImage: {
      type: String,
      default: ""
    },

    accountType: {
      type: String,
      enum: [
        "Student",
        "Instructor",
        "Learner"
      ],
      default: "Student"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);