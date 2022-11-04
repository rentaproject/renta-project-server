const express = require("express");

const Router = express.Router();

const locationController = require("../controllers/location");

Router.get("/", locationController.getLocation);

module.exports = Router;
