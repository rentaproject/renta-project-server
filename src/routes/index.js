const express = require("express");

const Router = express.Router();

const productRoutes = require("./product");
const authRoutes = require("./auth");
const vehicleRoutes = require("./vehicle");

Router.use("/product", productRoutes);
Router.use("/auth", authRoutes);
Router.use("/vehicle", vehicleRoutes);

module.exports = Router;
