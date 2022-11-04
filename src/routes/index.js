const express = require("express");

const Router = express.Router();

const productRoutes = require("./product");
const authRoutes = require("./auth");
const vehicleRoutes = require("./vehicle");
const categoryRoutes = require("./category");

Router.use("/product", productRoutes);
Router.use("/auth", authRoutes);
Router.use("/vehicle", vehicleRoutes);
Router.use("/category", categoryRoutes);

module.exports = Router;
