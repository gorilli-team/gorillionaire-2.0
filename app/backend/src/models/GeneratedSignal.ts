import { Schema, model } from "mongoose";

const GeneratedSignalSchema = new Schema({
  type: {
    type: String,
  },
  token: {
    type: String,
  },
  amount: {
    type: String,
  },
  signal_text: {
    type: String,
  },
  events: {
    type: Array,
  },
  confidenceScore: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  level: {
    type: String,
  },
});

export default model("Generated-Signal", GeneratedSignalSchema);
