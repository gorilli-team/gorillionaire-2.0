const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      index: true,
    },
    nonce: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    lastSignIn: {
      type: Date,
      default: Date.now,
    },
    isRewarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);
