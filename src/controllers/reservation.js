const wrapper = require("../utils/wrapper");
const reservationModel = require("../models/reservation");
// const vehicleModel = require("../models/vehicle");

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
        status: "Pending",
        startDate,
        returnDate,
        paymentMethod,
        totalPayment,
        quantity,
      };

      const result = await reservationModel.createReservation(setData);
      //   if (result > 1) {
      //     await vehicleModel
      //       .updateVehicle({ stock: setData.quantity, id: setData.vehicleId })
      //       .then(() => {
      //         wrapper.response(
      //           response,
      //           "Success",
      //           200,
      //           "Reservation Successfull",
      //           result.rows
      //         );
      //       })
      //       .catch((err) => {
      //         wrapper.response(
      //           response,
      //           "Error",
      //           500,
      //           "Failed update vehicle when reservation please try again later",
      //           err
      //         );
      //       });
      //   } else {
      //     wrapper.response(
      //       response,
      //       "Error",
      //       500,
      //       "Failed create data reservation please try again later"
      //     );
      //   }

      return wrapper.response(
        response,
        200,
        "success create reservation",
        result.rows
      );
    } catch (error) {
      console.log(error);
      return wrapper.response(response, 400, "Bad Request", null);
    }
  },
  getAllReservation: async (request, response) => {
    try {
      let { keyword } = request.query;
      keyword = keyword || "";

      // console.log(offset);
      const result = await reservationModel.getAllReservation(keyword);

      if (result.rows.length < 1) {
        return wrapper.response(response, 404, "No data found", []);
      }
      return wrapper.response(
        response,
        200,
        "Success get all reservation",
        result.rows
      );
    } catch (error) {
      console.log(error);
      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
  getReservationById: async (request, response) => {
    try {
      const { id } = request.params;

      const result = await reservationModel.getAllReservationById(id);

      if (result.rowCount < 1) {
        return wrapper.response(response, 404, "no data found", []);
      }
      return wrapper.response(
        response,
        200,
        "Success get reservation data",
        result.rows
      );
    } catch (error) {
      return console.log(error);
    }
  },
  getReservationByUserId: async (request, response) => {
    try {
      const { id } = request.params;

      const result = await reservationModel.getReservationUserById(id);

      if (result.rowCount < 1) {
        return wrapper.response(response, 404, "no data found", []);
      }
      return wrapper.response(
        response,
        200,
        "Success get reservation data",
        result.rows
      );
    } catch (error) {
      return console.log(error);
    }
  },
  updateReservation: async (request, response) => {
    try {
      const { status } = request.body;
      const { id } = request.params;
      const setData = {
        status,
        id,
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await reservationModel.updateReservation(setData);

      return wrapper.response(
        response,
        200,
        "Success update data",
        result.rows
      );
    } catch (error) {
      console.log(error);

      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
};
