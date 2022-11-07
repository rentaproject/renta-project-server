const wrapper = require("../utils/wrapper");
const reservationModel = require("../models/reservation");
// const vehicleModel = require("../models/vehicle");
const snapMidtrans = require("../utils/snapMidtrans");

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

      const setDataMidtrans = {
        // id: result.rows.reservationId,
        id: 1,
        totalPayment,
      };

      const resultMidtrans = await snapMidtrans.post(setDataMidtrans);
      const newResult = result.rows;

      return wrapper.response(response, 200, "success create reservation", {
        newResult,
        redirectUrl: resultMidtrans.redirect_url,
      });
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
  deleteReservation: async (request, response) => {
    try {
      const { id } = request.params;

      const checkData = await reservationModel.getAllReservationById(id);

      if (!checkData.rowCount) {
        return wrapper.response(
          response,
          404,
          "No data found with given ID",
          null
        );
      }

      await reservationModel.deleteReservation(id);

      return wrapper.response(response, 204, "Success delete data", []);
    } catch (error) {
      console.log(error);
      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
  midtransNotification: async (request, response) => {
    try {
      const result = await snapMidtrans.notif(request.body);

      const bookingId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;

      console.log(
        `Transaction notification received. Order ID: ${bookingId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "challenge",
            // updatedAt: ...
          };
          // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
          console.log(
            `Sukses melakukan pembayaran dengan id ${bookingId} dan data yang diubah ${JSON.stringify(
              setData
            )}`
          );
        } else if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "success",
            // updatedAt: ...
          };
          // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
          console.log(
            `Sukses melakukan pembayaran dengan id ${bookingId} dan data yang diubah ${JSON.stringify(
              setData
            )}`
          );
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "success",
          // updatedAt: ...
        };
        console.log(
          `Sukses melakukan pembayaran dengan id ${bookingId} dan data yang diubah ${JSON.stringify(
            setData
          )}`
        );
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "failed",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
        console.log(
          `Sukses melakukan pembayaran dengan id ${bookingId} dan data yang diubah ${JSON.stringify(
            setData
          )}`
        );
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "failed",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas\
        console.log(
          `Sukses melakukan pembayaran dengan id ${bookingId} dan data yang diubah ${JSON.stringify(
            setData
          )}`
        );
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "pending",
          // updatedAt: ...
        };
        // jalankan proses model untuk mengupdate data (setData) dan untuk bookingId didapat dari order_id diatas
        console.log(
          `Sukses melakukan pembayaran dengan id ${bookingId} dan data yang diubah ${JSON.stringify(
            setData
          )}`
        );
      }

      return wrapper.response(response, 200, "Success Update Status Booking", {
        bookingId,
        statusPayment: transactionStatus,
      });
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
