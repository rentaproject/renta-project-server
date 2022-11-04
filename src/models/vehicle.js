const connection = require("../config/postgresql");

module.exports = {
  getAllVehicles: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM vehicles",
        // [limit, offset, sort_by, asc],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getVehicleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM vehicles WHERE "vehicleId" = $1`,
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
  addNewVehicle: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO vehicles ("typeId", name, status, price, stock, description, "rentCount") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          data.typeId,
          data.name,
          data.status,
          data.price,
          data.stock,
          data.description,
          data.rentCount,
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
};
