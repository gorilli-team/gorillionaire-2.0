const mongoose = require("mongoose");

const TokenHoldersSchema = new mongoose.Schema({
  tokenAddress: {
    type: String,
    required: true,
  },
  tokenName: {
    type: String,
  },
  total: {
    type: Number,
    min: 0,
  },
  holders: [
    {
      holder: {
        type: String,
        required: true,
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      amount: {
        type: Number,
        min: 0,
      },
      isContract: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("TokenHolders", TokenHoldersSchema);
