const redis = require("redis");

const client = redis.createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});

// local redis
// const client = redis.createClient();

// (async () => {
//   client.connect();
//   client.on("connect", () => {
//     // eslint-disable-next-line no-console
//     console.log("You're connected db redis ...");
//   });
// })();

module.exports = client;

// const { createClient } = require("redis");

// const client = createClient({
//   url: process.env.REDIS_CLIENT_URL,
// });
// const redisConn = async () => {
//   try {
//     client.on("error", (error) => console.log(error));
//     await client.connect();

//     console.log("You are connected to redis");
//   } catch (error) {
//     console.log(`Error:${error.message}`);
//   }
// };

// module.exports = { redisConn, client };
