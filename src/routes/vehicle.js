const express = require("express");

const Router = express.Router();

const vehicleController = require("../controllers/vehicle");

Router.get("/", vehicleController.getAllVehicles);
Router.get("/:id", vehicleController.getVehicleById);
Router.get("/type/:id", vehicleController.getVehicleByType);
Router.post("/", vehicleController.addNewVehicle);
Router.patch("/:id", vehicleController.updateVehicle);
Router.delete("/:id", vehicleController.deleteVehicle);
Router.patch("/reservation/:id", vehicleController.updateReservationVehicle);
Router.patch("/return/:id", vehicleController.updateReturnVehicle);

module.exports = Router;
