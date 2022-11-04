const express = require("express");

const Router = express.Router();

const categoryController = require("../controllers/category");

Router.get("/", categoryController.getAllCategory);

module.exports = Router;
