/* eslint-disable consistent-return */
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

// const timeout = require('connect-timeout')

module.exports = {
  uploadUser: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "renta-project/profile",
      },
    });
    const upload = multer({
      // MULTER SETTING
      storage,
      // FILTERING TYPE AND SIZE FILE
      fileFilter(_req, file, callback) {
        const ext = file.mimetype.split("/")[1];
        if (ext !== "png" && ext !== "jpg" && ext !== "gif" && ext !== "jpeg") {
          return callback(new Error("Only images are allowed"));
        }
        return callback(null, true);
      },
      limits: {
        fileSize: 500 * 1024,
      },
    }).single("image");

    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);
        return wrapper.response(response, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        console.log(err);
        return wrapper.response(response, 401, err.message, null);
      }

      // Everything went fine.
      return next();
    });
  },
  uploadImage: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "renta-project",
      },
    });
    const largeSize = 500000;
    const upload = multer({
      storage,
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (
          ext !== ".jpg" &&
          ext !== ".jpeg" &&
          ext !== ".png" &&
          ext !== ".PNG"
        ) {
          cb(new Error("Only type .jpeg/jpg/png are allowed"), false);
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: largeSize },
      // }).single("image", { timeout: 600000 });
    }).single("image");
    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      // Everything went fine.
      next();
    });
  },
  uploadVehicleImage: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "renta-project",
      },
    });
    const largeSize = 500000;
    const upload = multer({
      storage,
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (
          ext !== ".jpg" &&
          ext !== ".jpeg" &&
          ext !== ".png" &&
          ext !== ".PNG"
        ) {
          cb(new Error("Only type .jpeg/jpg/png are allowed"), false);
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: largeSize },
    }).array("images", 3);
    // }).single("image", { timeout: 600000 });
    // }).single("image");
    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      // Everything went fine.
      next();
    });
  },
  testUpload: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "renta-project",
        allowed_formats: ["jpg", "jpeg", "png"],
      },
    });

    const upload = multer({ storage, limits: { fileSize: 500000 } }).fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
    ]);

    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      // Everything went fine.
      next();
    });
  },
};
