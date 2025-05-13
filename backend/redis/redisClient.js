const redis = require('redis');

const client = redis.createClient({
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

module.exports = client;