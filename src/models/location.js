const connection = require("../config/postgresql");

module.exports = {
  getLocation: () =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM locations`, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    }),
};
