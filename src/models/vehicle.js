const connection = require("../config/postgresql");

module.exports = {
  // sort by ASC or DESC still not working
  getAllVehicles: (keyword, limit, offset, orderBy, orderType, location) =>
    new Promise((resolve, reject) => {
      let i = 1;
      let sqlQuery = `SELECT v.*, l."name" as "locationName" FROM vehicles v JOIN locations l on v."locationId" = l."locationId" WHERE v.name ilike '%' || $${i} ||'%' `;

      const sqlQueryValues = [keyword];
      if (location) {
        i += 1;
        sqlQuery += `AND v."locationId" = $${i} `;
        sqlQueryValues.push(location);
      }

      sqlQuery += `ORDER BY v."${orderBy}" ${orderType} LIMIT $${
        i + 1
      } OFFSET $${i + 2}`;

      sqlQueryValues.push(limit, offset);

      connection.query(sqlQuery, sqlQueryValues, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
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
  getVehicleByType: (type, offset, limit) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM vehicles WHERE "typeId" = $1 LIMIT $2 OFFSET $3`,
        [type, limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updateVehicle: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE vehicles SET "name" = $1, "typeId" = $2, "status" = $3, "price" = $4, "stock" = $5, "description" = $6, "rentCount" = $7 WHERE "vehicleId" = $8 RETURNING *`,
        [
          data.name,
          data.typeId,
          data.status,
          data.price,
          data.stock,
          data.description,
          data.rentCount,
          data.id,
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
  deleteVehicle: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM vehicles WHERE "vehicleId" = $1`,
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
  updateReservationVehicle: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE vehicles SET "rentCount" = "rentCount" + 1, "stock" = "stock" - ${data.stock} WHERE "vehicleId" = $1 RETURNING *`,
        [data.id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updateReturnVehicle: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE vehicles SET "stock" = "stock" + ${data.stock} WHERE "vehicleId" = $1 RETURNING *`,
        [data.id],
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
