const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dnhoxflfj",
  api_key: "338328458243391",
  api_secret: "KoUWJyePt3xJ22iI-0HSjW5txfA",
  secure: true,
});

module.exports = cloudinary;
