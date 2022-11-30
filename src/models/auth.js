const db = require("../config/postgresql");

module.exports = {
  getAlldata: () =>
    new Promise((resolve, reject) => {
      db.query("SELECT * FROM users", (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    }),
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
  updateProfile: (userId, data) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET name=$1, username=$2, gender=$3, address=$4, "dateOfBirth"=$5, "phoneNumber"=$6 WHERE "userId"=$7`,
        [
          data.name,
          data.username,
          data.gender,
          data.address,
          data.dateOfBirth,
          data.phoneNumber,
          userId,
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
  updateImages: (id, data) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET image=$1 WHERE "userId"=$2 RETURNING * `,
        [data.image, id],
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
