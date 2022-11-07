/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const wrapper = require("../utils/wrapper");

module.exports = {
  authentication: async (request, response, next) => {
    try {
      const token = request.headers.authorization;
      if (!token) {
        return wrapper.response(response, 403, "Please Login First", null);
      }

      jwt.verify(
        token.split(" ")[1],
        process.env.TOKEN_SECRET,
        (error, result) => {
          if (error) {
            return wrapper.response(response, 403, error.message, null);
          }

          request.decodeToken = result;
          return next();
        }
      );
    } catch (error) {
      return error.error;
    }
  },
  isAdmin: async (request, response, next) => {
    try {
      if (request.decodeToken.role.toLowerCase() !== "admin") {
        return wrapper.response(
          response,
          403,
          "Sorry, only admin can access this request",
          null
        );
      }
      return next();
    } catch (error) {
      return error.error;
    }
  },
};
