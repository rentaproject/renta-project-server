const express = require("express");

const Router = express.Router();

const reservationConroller = require("../controllers/reservation");

Router.post("/", reservationConroller.createReservation);
Router.get("/", reservationConroller.getAllReservation);
Router.patch("/:id", reservationConroller.updateReservation);
Router.get("/:id", reservationConroller.getReservationById);
Router.get("/user/:id", reservationConroller.getReservationByUserId);

module.exports = Router;
