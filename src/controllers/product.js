const productModel = require("../models/product");
const wrapper = require("../utils/wrapper");

module.exports = {
  showGreetings: async (request, response) => {
    try {
      return wrapper.response(response, 200, "Success Get Greetings", null);
    } catch (error) {
      return console.log(error);
    }
  },
  getAllProduct: async (request, response) => {
    try {
      const { limit, offset } = request.query;
      const result = await productModel.getAllProduct(limit, offset);
      return wrapper.response(
        response,
        200,
        "Success Get All Product",
        result.rows
      );
    } catch (error) {
      return console.log(error);
    }
  },
  getProductById: async (request, response) => {
    try {
      return wrapper.response(response, 200, "Success Get Product By Id", null);
    } catch (error) {
      return console.log(error);
    }
  },
  createProduct: async (request, response) => {
    try {
      const result = await productModel.createProduct(request.body);
      console.log(result);
      return wrapper.response(
        response,
        200,
        "Success Create Product",
        request.body
      );
    } catch (error) {
      return console.log(error);
    }
  },
  updateProduct: async (request, response) => {
    try {
      return wrapper.response(response, 200, "Success Update Product", null);
    } catch (error) {
      return console.log(error);
    }
  },
  deleteProduct: async (request, response) => {
    try {
      return wrapper.response(response, 200, "Success Delete Product", null);
    } catch (error) {
      return console.log(error);
    }
  },
};
