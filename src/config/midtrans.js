const midtransClient = require("midtrans-client");

const isProduction = false;
const serverKey = process.env.MIDTRANS_SERVER_KEY;
const clientKey = process.env.MIDTRANS_CLIENT_KEY;

const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

module.exports = snap;
