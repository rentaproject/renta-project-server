const express = require("express");

const Router = express.Router();

const productRoutes = require("./product");
const authRoutes = require("./auth");
const vehicleRoutes = require("./vehicle");
const categoryRoutes = require("./category");
const locationRoutes = require("./location");
const reservationRoutes = require("./reservation");

Router.use("/product", productRoutes);
Router.use("/auth", authRoutes);
Router.use("/vehicle", vehicleRoutes);
Router.use("/category", categoryRoutes);
Router.use("/location", locationRoutes);
Router.use("/reservation", reservationRoutes);

module.exports = Router;
