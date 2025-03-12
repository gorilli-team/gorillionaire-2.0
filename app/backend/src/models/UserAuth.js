const mongoose = require("mongoose");

const UserAuthSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
  },
  privyAccessToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UserAuth", UserAuthSchema);
