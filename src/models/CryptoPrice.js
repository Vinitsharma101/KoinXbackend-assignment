const mongoose = require('mongoose');

const cryptoPriceSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    enum: ['BTC', 'ETH', 'MATIC'],
  },
  priceUSD: {
    type: Number,
    required: true,
  },
  marketCapUSD: {
    type: Number,
    required: true,
  },
  change24h: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CryptoPrice = mongoose.model('CryptoPrice', cryptoPriceSchema);
module.exports = CryptoPrice;
