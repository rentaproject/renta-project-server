const db = require("../config/postgresql");

module.exports = {
  registerAdmin: (data) =>
    new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO users (name, email, role, password) VALUES ($1, $2,$3,$4) RETURNING *",
        [data.name, data.email, data.role, data.password],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email=$1",
        [email],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getUserByID: (data) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE "userId"=$1`,
        [data],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updateDataUser: (userId, data) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET status=$1 WHERE "userId"=$2  RETURNING *`,
        [data.status, userId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  updatePassword: (userId, data) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET password=$1 WHERE "userId"=$2  RETURNING *`,
        [data.password, userId],
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
