const express = require('express');
const router = express.Router();
const CryptoPrice = require('../models/CryptoPrice');

router.get('/stats', async (req, res) => {
  try {
    const { coin } = req.query;

    // Validate coin parameter
    const validCoins = ['bitcoin', 'ethereum', 'matic-network'];
    if (!validCoins.includes(coin)) {
      return res.status(400).json({
        error: 'Invalid coin. Must be one of: bitcoin, ethereum, matic-network',
      });
    }

    // Map API coin names to database symbols
    const coinToSymbol = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      'matic-network': 'MATIC',
    };

    // Get latest data from database
    const latestData = await CryptoPrice.findOne(
      { symbol: coinToSymbol[coin] },
      { _id: 0, __v: 0 } // Exclude these fields
    ).sort({ timestamp: -1 });

    if (!latestData) {
      return res.status(404).json({ error: 'No data found for this coin' });
    }

    // Format response according to the sample response structure
    const response = {
      price: latestData.priceUSD,
      marketCap: latestData.marketCapUSD,
      '24hChange': latestData.change24h,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to calculate standard deviation
function calculateStandardDeviation(prices) {
  const n = prices.length;
  const mean = prices.reduce((sum, price) => sum + price, 0) / n;
  const squareDiffs = prices.map((price) => Math.pow(price - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, diff) => sum + diff, 0) / n;
  return Math.sqrt(avgSquareDiff);
}

// Add this new route
router.get('/deviation', async (req, res) => {
  try {
    const { coin } = req.query;

    // Validate coin parameter
    const validCoins = ['bitcoin', 'ethereum', 'matic-network'];
    if (!validCoins.includes(coin)) {
      return res.status(400).json({
        error: 'Invalid coin. Must be one of: bitcoin, ethereum, matic-network',
      });
    }

    // Map API coin names to database symbols
    const coinToSymbol = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      'matic-network': 'MATIC',
    };

    // Get last 100 records for the coin
    const records = await CryptoPrice.find({ symbol: coinToSymbol[coin] }, { priceUSD: 1, _id: 0 })
      .sort({ timestamp: -1 })
      .limit(100);

    if (!records.length) {
      return res.status(404).json({ error: 'No data found for this coin' });
    }

    // Calculate standard deviation
    const prices = records.map((record) => record.priceUSD);
    const deviation = calculateStandardDeviation(prices);

    res.json({ deviation: Number(deviation.toFixed(2)) });
  } catch (error) {
    console.error('Error calculating deviation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
