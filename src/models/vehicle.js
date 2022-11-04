const connection = require("../config/postgresql");

module.exports = {
  // sort by ASC or DESC still not working
  getAllVehicles: (keyword, limit, offset, orderBy, orderType) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM vehicles WHERE name ilike '%' || $1 ||'%' ORDER BY $2 ${orderType.toLowerCase()} LIMIT $3 OFFSET $4`,
        [keyword, orderBy, limit, offset],
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
