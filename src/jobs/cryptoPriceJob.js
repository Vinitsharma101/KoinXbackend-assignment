const cron = require('node-cron');
const { fetchCryptoPrices } = require('../services/coinGecko.service');

// Run immediately when server starts
fetchCryptoPrices();

// Schedule to run every 2 hours
cron.schedule('0 */2 * * *', fetchCryptoPrices);
