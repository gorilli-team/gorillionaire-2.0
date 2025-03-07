const mongoose = require('mongoose');

const priceDataSchema = new mongoose.Schema({
  tokenSymbol: {
    type: String,
    required: true,
    enum: ['CHOG', 'MOYAKI', 'MOLANDAK']
  },
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  blockNumber: {
    type: Number,
    required: true
  },
  pairAddress: {
    type: String,
    required: true
  },
  timeWindowSeconds: {
    type: Number,
    required: true
  }
});

// Create compound index for efficient queries
priceDataSchema.index({ tokenSymbol: 1, timestamp: -1 });

module.exports = mongoose.model('PriceData', priceDataSchema); 