let client;

if (process.env.NODE_ENV !== 'test') {
  const redis = require('redis');

  client = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || 'redis',
      port: Number(process.env.REDIS_PORT) || 6379
    }
  });

  console.log('REDIS_HOST:', process.env.REDIS_HOST);

  client.on('error', (err) => {
    console.error('Redis error:', err);
  });

  client.connect().catch(err => console.error('Redis connect error:', err));
} else {
  console.log('Skipping Redis setup in test environment.');
  client = {
    get: async () => null,
    set: async () => null,
    del: async () => null,
    // Add more mocked methods if needed
  };
}

module.exports = client;