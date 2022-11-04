const redis = require("redis");

// cloud redis
// const client = redis.createClient({
//   url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   // socket: {
//   //   host: process.env.REDIS_HOST,
//   //   port: process.env.REDIS_PORT,
//   // },
//   // password: process.env.REDIS_PASSWORD,
// });

// local redis
const client = redis.createClient();

(async () => {
  client.connect();
  client.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("You're connected db redis ...");
  });
})();

module.exports = client;
