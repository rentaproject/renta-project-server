const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");
const { sendMail, mailForgotPassword } = require("../utils/mail");
const client = require("../config/redis");

module.exports = {
  registerAdmin: async (request, response) => {
    try {
      const { name, email, password } = request.body;
      const checkEmail = await authModel.getUserByEmail(email);

      if (checkEmail.rows.length > 0) {
        return wrapper.response(response, 403, "Email Alredy Registered");
      }

      if (password.length < 6) {
        return wrapper.response(response, 400, "Password at least 6 character");
      }

      const hash = bcrypt.hashSync(password, 10);
      const setData = {
        name,
        email,
        role: "admin",
        password: hash,
      };

      const minm = 100000;
      const maxm = 999999;
      const otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

      const setMailOptions = {
        to: email,
        name,
        subject: "Email Verification",
        template: "verify.html",
        actionUrl: `localhost:3001/api/users/verify/${otp}`,
      };
      await sendMail(setMailOptions);

      const result = await authModel.registerAdmin(setData);
      client.set(`${otp}`, JSON.stringify(result.rows));
      const newResult = {
        userId: result.rows[0].userId,
        name: result.rows[0].name,
        email: result.rows[0].email,
        role: result.rows[0].role,
      };
      return wrapper.response(
        response,
        200,
        "Success register, Please check your email",
        newResult
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorInput = null,
      } = error;
      return wrapper.response(response, status, statusText, errorInput);
    }
  },
  registerUser: async (request, response) => {
    try {
      const { name, email, password } = request.body;
      const checkEmail = await authModel.getUserByEmail(email);

      if (checkEmail.rows.length > 0) {
        return wrapper.response(response, 403, "Email Alredy Registered");
      }

      if (password.length < 6) {
        return wrapper.response(response, 400, "Password at least 6 character");
      }

      const hash = bcrypt.hashSync(password, 10);
      const setData = {
        name,
        email,
        role: "user",
        password: hash,
      };

      const minm = 100000;
      const maxm = 999999;
      const otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

      const setMailOptions = {
        to: email,
        name,
        subject: "Email Verification",
        template: "verify.html",
        actionUrl: `localhost:3001/api/auth/verify/${otp}`,
      };
      await sendMail(setMailOptions);

      const result = await authModel.registerAdmin(setData);
      client.set(`${otp}`, JSON.stringify(result.rows));

      const newResult = {
        userId: result.rows[0].userId,
        name: result.rows[0].name,
        email: result.rows[0].email,
        role: result.rows[0].role,
      };
      return wrapper.response(
        response,
        200,
        "Success register, Please check your email",
        newResult
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorInput = null,
      } = error;
      return wrapper.response(response, status, statusText, errorInput);
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;
      const checkEmail = await authModel.getUserByEmail(email);

      if (checkEmail.rows.length < 1) {
        return wrapper.response(response, 403, "Email is not registered");
      }
      if (checkEmail.rows[0].status == null) {
        return wrapper.response(response, 200, `Please verivied your email`);
      }
      const isValid = await bcrypt
        .compare(password, checkEmail.rows[0].password)
        .then((result) => result);

      if (!isValid) {
        return wrapper.response(response, 400, "Wrong Password");
      }
      const payload = {
        userId: checkEmail.rows[0].userId,
        role: checkEmail.rows[0].role,
      };

      const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });

      // const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      //   expiresIn: "36h",
      // });

      const newResult = {
        userId: checkEmail.rows[0].userId,
        role: checkEmail.rows[0].role,
        token,
        // refreshToken,
      };
      return wrapper.response(response, 200, "Success Login", newResult);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorInput = null,
      } = error;
      return wrapper.response(response, status, statusText, errorInput);
    }
  },
  verify: async (request, response) => {
    try {
      const { otp } = request.params;
      let result = await client.get(otp);

      result = JSON.parse(result);

      const checkId = await authModel.getUserByID(result[0].userId);

      if (checkId.length < 0) {
        return wrapper.response(response, 400, `Wrong OTP`);
      }

      const updateData = {
        status: "verified",
      };
      let newresult = await authModel.updateDataUser(
        result[0].userId,
        updateData
      );
      newresult = {
        userId: newresult.rows[0].userId,
        status: newresult.rows[0].status,
        createdAt: newresult.rows[0].createdAt,
        updatedAt: newresult.rows[0].updatedAt,
      };
      return wrapper.response(response, 200, "Success Verify User", newresult);
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
  logout: async (request, response) => {
    try {
      const authHeader = request.headers.authorization;
      // const { refreshtoken } = request.headers;

      const token = authHeader.split(" ")[1];
      client.setEx(token, 3600 * 2, token);
      // client.setEx(refreshtoken, 3600 * 2, refreshtoken);

      return wrapper.response(response, 200, "Success Logout");
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  forgotPassword: async (request, response) => {
    try {
      const { email } = request.body;
      const checkEmail = await authModel.getUserByEmail(email);

      if (checkEmail.rows.length < 0) {
        return wrapper.response(response, 400, "Email Not Registered", null);
      }
      const { userId } = checkEmail.rows[0];
      const { name } = checkEmail.rows[0];

      const minm = 100000;
      const maxm = 999999;
      const otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

      const setMailOptions = {
        to: email,
        name,
        subject: "Email Verification",
        template: "verify.html",
        actionUrl: `localhost:3001/api/users/verify/${otp}`,
      };

      client.set(`${otp}`, JSON.stringify(userId));

      await mailForgotPassword(setMailOptions);
      const result = { email: checkEmail.rows[0].email };

      return wrapper.response(
        response,
        200,
        "Process Success Please Check Your Email",
        result
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  resetPassword: async (request, response) => {
    try {
      const { otp } = request.params;
      const { newPassword, confirmPassword } = request.body;

      let userId = await client.get(otp);
      userId = JSON.parse(userId);

      if (userId == null) {
        return wrapper.response(response, 400, "Otp goes wrong", null);
      }

      const checkId = await authModel.getUserByID(userId);

      if (checkId.rows[0].length < 1) {
        return wrapper.response(
          response,
          404,
          `Update By Id ${userId} Not Found`,
          []
        );
      }

      if (newPassword !== confirmPassword) {
        return wrapper.response(response, 400, "Password Not Match", null);
      }

      const hash = bcrypt.hashSync(newPassword, 10);
      const setData = {
        password: hash,
      };
      await authModel.updatePassword(userId, setData);

      const result = [{ userId: checkId.rows[0].userId }];

      return wrapper.response(response, 200, "Success Reset Password ", result);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};