// config/redisClient.js
const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', err => console.error('Redis Error:', err));

// ✅ Define this function BEFORE exporting
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis Cloud');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
};


module.exports = { redisClient, connectRedis };

