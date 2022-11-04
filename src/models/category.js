const connection = require("../config/postgresql");

module.exports = {
  getAllCategory: () =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM types`, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    }),
};
