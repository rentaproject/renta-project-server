const midtransClient = require("midtrans-client");

const isProduction = false;
const serverKey = "SB-Mid-server-3BhoH9i4_d2B9PXMo1Hudojb";
const clientKey = "SB-Mid-client-m40SSk7nIFaNNLia";

const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

module.exports = snap;
