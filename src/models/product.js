const connection = require("../config/postgresql");

module.exports = {
  showGreetings: () => new Promise((resolve, reject) => {}),
  getAllProduct: (limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        // `SELECT * FROM product LIMIT ${limit} OFFSET ${offset}`, SELECT * FROM product LIMIT 5 OFFSET 0; DROP TABLE product;
        "SELECT * FROM product LIMIT $1 OFFSET $2",
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getProductById: () => new Promise((resolve, reject) => {}),
  createProduct: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO product (name, price) VALUES ($1, $2)",
        [data.name, data.price],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updateProduct: () => new Promise((resolve, reject) => {}),
  deleteProduct: () => new Promise((resolve, reject) => {}),
};
