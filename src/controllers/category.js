const categoryModel = require("../models/category");
const wrapper = require("../utils/wrapper");

module.exports = {
  getAllCategory: async (request, response) => {
    try {
      const result = await categoryModel.getAllCategory();
      return wrapper.response(response, 200, "Success get data", result.rows);
    } catch (error) {
      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
};
