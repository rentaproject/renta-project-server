/* eslint-disable prettier/prettier */
const express = require("express");

const Router = express.Router();

const authController = require("../controllers/auth");
const uploadMiddleware = require("../middleware/uploads");

Router.get("/user/:id", authController.getDatabyId);
Router.get("/alldata", authController.getAllUser);
Router.patch("/updateprofile/:id", authController.updateUserData);
Router.patch("/updatepassword/:id", authController.updatePasswordUser)

// role admin
Router.post("/admin/register", authController.registerAdmin);

// role users
Router.post("/user/register", authController.registerUser);

Router.post("/login", authController.login);
Router.get("/verify/:otp", authController.verify);
Router.post("/logout", authController.logout);
Router.post("/forgotpassword", authController.forgotPassword);
Router.patch("/forgotpassword/:otp", authController.resetPassword);

Router.patch("/image/:id", uploadMiddleware.uploadImage, authController.updateImages);
module.exports = Router;
