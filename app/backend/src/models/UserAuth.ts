import { Schema, model } from "mongoose";

const UserAuthSchema = new Schema({
  userAddress: {
    type: String,
    required: true,
  },
  privyAccessToken: {
    type: String,
    required: true,
  },
});

export default model("UserAuth", UserAuthSchema);
