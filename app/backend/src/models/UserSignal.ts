import { Schema, model } from "mongoose";

const UserSignalSchema = new Schema({
  userAddress: {
    type: String,
    required: true,
  },
  signalId: {
    type: String,
    required: true,
  },
  choice: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default model("User-Signal", UserSignalSchema);
