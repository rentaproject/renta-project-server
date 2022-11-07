const connection = require("../config/postgresql");

module.exports = {
  createReservation: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO reservation ("userId", "vehicleId", "status", "startDate", "returnDate", "paymentMethod", "totalPayment", "quantity") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          data.userId,
          data.vehicleId,
          data.status,
          data.startDate,
          data.returnDate,
          data.paymentMethod,
          data.totalPayment,
          data.quantity,
        ],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getAllReservation: (keyword) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM getreservationWithVehicle WHERE name ilike '%' || $1 ||'%'`,
        [keyword],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getAllReservationById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM getreservationWithVehicle WHERE "reservationId" = $1`,
        [id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getReservationUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM getreservationWithVehicle WHERE "userId" = $1`,
        [id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updateReservation: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE reservation SET "status" = $1  WHERE "reservationId" = $2 RETURNING *`,
        [data.status, data.id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  deleteReservation: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM reservation WHERE "reservationId" = $1`,
        [id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
};
