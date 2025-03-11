const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      index: true,
    },
    rank: {
      type: Number,
      default: 1,
    },
    nonce: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    lastSignIn: {
      type: Date,
      default: Date.now,
    },
    activitiesList: [
      {
        name: String,
        points: Number,
        date: Date,
      },
    ],
    streak: {
      type: Number,
      default: 0,
    },
    isRewarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);
