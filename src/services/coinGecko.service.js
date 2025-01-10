const axios = require('axios');
const CryptoPrice = require('../models/CryptoPrice');

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
const COIN_IDS = ['bitcoin', 'ethereum', 'matic-network'];

const fetchCryptoPrices = async () => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&x_cg_demo_api_key=${COINGECKO_API_KEY}`
    );

    const coinSymbols = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      'matic-network': 'MATIC',
    };

    const updates = Object.entries(response.data).map(([coinId, data]) => ({
      symbol: coinSymbols[coinId],
      priceUSD: data.usd,
      marketCapUSD: data.usd_market_cap,
      change24h: data.usd_24h_change,
      timestamp: new Date(),
    }));

    await CryptoPrice.insertMany(updates);
    console.log('Crypto prices updated successfully');
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
  }
};

module.exports = { fetchCryptoPrices };
