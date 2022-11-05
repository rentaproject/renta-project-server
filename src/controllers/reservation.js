const wrapper = require("../utils/wrapper");
const vehicleModel = require("../models/vehicle");

module.exports = {
  createReservation: async (request, response) => {
    try {
      const {
        userId,
        vehicleId,
        startDate,
        returnDate,
        paymentMethod,
        totalPayment,
        quantity,
      } = request.body;
      const setData = {
        userId,
        vehicleId,
        startDate,
        returnDate,
        paymentMethod,
        totalPayment,
        quantity,
      };
      console.log(setData);
    } catch (error) {
      console.log(error);
      return wrapper.response(response, 400, "Bad Request", null);
    }
  },
};
