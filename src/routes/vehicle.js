const express = require("express");

const Router = express.Router();

const vehicleController = require("../controllers/vehicle");
const uploadMiddleware = require("../middleware/uploads");

Router.get("/", vehicleController.getAllVehicles);
Router.get("/:id", vehicleController.getVehicleById);
Router.get("/type/:id", vehicleController.getVehicleByType);
Router.post("/", uploadMiddleware.testUpload, vehicleController.addNewVehicle);
Router.patch("/:id", vehicleController.updateVehicle);
Router.delete("/:id", vehicleController.deleteVehicle);
Router.patch("/reservation/:id", vehicleController.updateReservationVehicle);
Router.patch("/return/:id", vehicleController.updateReturnVehicle);

module.exports = Router;
