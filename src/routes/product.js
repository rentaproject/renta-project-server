const express = require("express");

const Router = express.Router();

const productController = require("../controllers/product");

Router.get("/greetings", productController.showGreetings);
Router.get("/", productController.getAllProduct);
Router.get("/:id", productController.getProductById);
Router.post("/", productController.createProduct);
Router.patch("/:id", productController.updateProduct);
Router.delete("/:id", productController.deleteProduct);

module.exports = Router;
