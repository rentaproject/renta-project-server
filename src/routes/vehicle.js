const express = require("express");

const Router = express.Router();

const vehicleController = require("../controllers/vehicle");

Router.get("/", vehicleController.getAllVehicles);
Router.get("/:id", vehicleController.getVehicleById);
Router.post("/", vehicleController.addNewVehicle);

module.exports = Router;
