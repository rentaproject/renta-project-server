const express = require("express");

const Router = express.Router();

const authController = require("../controllers/auth");

// role admin
Router.post("/admin/register", authController.registerAdmin);

// role users
Router.post("/user/register", authController.registerUser);

Router.post("/login", authController.login);
Router.get("/verify/:otp", authController.verify);
Router.post("/logout", authController.logout);
Router.post("/forgotpassword", authController.forgotPassword);
Router.patch("/forgotpassword/:otp", authController.resetPassword);

module.exports = Router;
