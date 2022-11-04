const locationModel = require("../models/location");
const wrapper = require("../utils/wrapper");

module.exports = {
  getLocation: async (request, response) => {
    try {
      const result = await locationModel.getLocation();

      if (result.rows.length < 1) {
        return wrapper.response(response, 404, "No Data Found", null);
      }

      return wrapper.response(response, 200, "Success get data", result.rows);
    } catch (error) {
      console.log(error);
      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
};
