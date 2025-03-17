import { Schema, model } from "mongoose";

const userActivitySchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      index: true,
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
        txHash: String,
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

export default model("UserActivity", userActivitySchema);
