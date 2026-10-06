const mongoose = require("mongoose");

const learningActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

learningActivitySchema.index(
  { userId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "LearningActivity",
  learningActivitySchema
);