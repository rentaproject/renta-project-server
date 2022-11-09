/* eslint-disable prettier/prettier */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authModel = require("../models/auth");
// const updateTime = require("../utils/updateTime");
const cloudinary = require("../config/cloudinary");
const wrapper = require("../utils/wrapper");
const { sendMail, mailForgotPassword } = require("../utils/mail");
const client = require("../config/redis");
const hash = require("../utils/hash");

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

      const hashPass = bcrypt.hashSync(password, 10);
      const setData = {
        name,
        email,
        role: "admin",
        password: hashPass,
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

      const hashPass = bcrypt.hashSync(password, 10);
      const setData = {
        name,
        email,
        role: "user",
        password: hashPass,
      };

      const minm = 100000;
      const maxm = 999999;
      const otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

      const setMailOptions = {
        to: email,
        name,
        subject: "Email Verification",
        template: "verify.html",
        actionUrl: `https://renta-project-server.vercel.app/api/auth/verify/${otp}`,
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

      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
        expiresIn: "36h",
      });

      const newResult = {
        userId: checkEmail.rows[0].userId,
        token,
        refreshToken,
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
      const { refreshtoken } = request.headers;

      const token = authHeader.split(" ")[1];
      client.setEx(token, 3600 * 2, token);
      client.setEx(refreshtoken, 3600 * 2, refreshtoken);

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
        subject: "Reset Password",
        template: "forgotpw.html",
        actionUrl: `http://localhost:3000/auth/password/reset/${otp}`,
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

      const hashPass = bcrypt.hashSync(newPassword, 10);
      const setData = {
        password: hashPass,
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
  getDatabyId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await authModel.getUserByID(id);

      return wrapper.response(
        response,
        200,
        "Success get data by id",
        result.rows
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
  getAllUser: async (request, response) => {
    try {
      const result = await authModel.getAlldata();
      return wrapper.response(
        response,
        200,
        "Success get all data",
        result.rows,
        {
          totalData: result.rowCount,
        }
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
  updateUserData: async (request, response) => {
    try {
      const { id } = request.params;
      const { name, username, gender, address, dateOfBirth, phoneNumber } =
        request.body;

      const checkId = await authModel.getUserByID(id);

      if (checkId.rows.length < 1) {
        return wrapper.response(response, 404, `User is not Found`, []);
      }
      // const dateTime = updateTime.dateTime();
      const updateData = {
        name: name === ""||null?checkId.rows[0].name : name ,
        username: username === ""||null?checkId.rows[0].username : username ,
        gender: gender === ""||null?checkId.rows[0].gender : gender,
        address: address === ""||null?checkId.rows[0].address : address,
        dateOfBirth: dateOfBirth === ""||null?checkId.rows[0].dateOfBirth : dateOfBirth,
        phoneNumber: phoneNumber === ""||null?checkId.rows[0].phoneNumber : phoneNumber,
      };

      await authModel.updateProfile(id, updateData);
      const result = await authModel.getUserByID(id);

      return wrapper.response(
        response,
        200,
        "Success Update Profile",
        result.rows
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
  updateImages: async (request, response) => {
    try {
      const { id } = request.params;

      const isFalid = await authModel.getUserByID(id);

      if (!request.file) {
        return wrapper.response(response, 400, "Image must be filled", null);
      }
      const { filename } = request.file;
      let newImages;

      if (isFalid.rows.length < 1) {
        return wrapper.response(response, 404, `User is not Found`, []);
      }
      if (isFalid.rows[0].image === null) {
        newImages = filename;
      }

      if (isFalid.rows[0].image) {
        await cloudinary.uploader.destroy(isFalid.rows[0].image);
        newImages = filename;
      }

      const inputData = {
        image: newImages,
      };

      const result = await authModel.updateImages(id, inputData);
      return wrapper.response(
        response,
        200,
        "Success Update Image Profile",
        result.rows
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
  updatePasswordUser: async (request, response) => {
    try {
      const { id } = request.params;

      const { oldPassword, newPassword, confirmPassword } = request.body;

      const isFalid = await authModel.getUserByID(id);

      if (isFalid.rows.length < 1) {
        return wrapper.response(response, 404, `User is not Found`, []);
      }
      const getPass = await authModel.getUserByID(id);

      const checkPassword = hash.checkPassword(
        oldPassword,
        getPass.rows[0].password
      );

      if (checkPassword === false) {
        return wrapper.response(response, 401, `Current password false`);
      }

      if (newPassword !== confirmPassword) {
        return wrapper.response(
          response,
          401,
          `New password and confirm password did not match`
        );
      }
      const hashPw = hash.hashPass(confirmPassword);

      const updatePassword = {
        password: hashPw,
      };

      const result = await authModel.updatePassword(id, updatePassword);
      return wrapper.response(
        response,
        200,
        "Success Update password",
        result.rows
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
};
