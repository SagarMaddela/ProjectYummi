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

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
};

// Connect immediately on import
connectRedis();

module.exports = redisClient; // ✅ Export only the client
