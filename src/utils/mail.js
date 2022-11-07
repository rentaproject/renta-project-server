const nodemailer = require("nodemailer");
const fs = require("fs");
const mustache = require("mustache");
const gmail = require("../config/gmail");

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "vehiclerental10@gmail.com",
          clientId: gmail.clientId,
          clientSecret: gmail.clientSecret,
          refreshToken: gmail.refreshToken,
          accessToken: gmail.accessToken,
        },
      });
      const templates = fs.readFileSync(
        `src/templates/${data.template}`,
        "utf-8"
      );
      const mailOptions = {
        from: '"RENTA" -- <vehiclerental10@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(templates, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }),
  mailForgotPassword: (data) =>
    new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "vehiclerental10@gmail.com",
          clientId: gmail.clientId,
          clientSecret: gmail.clientSecret,
          refreshToken: gmail.refreshToken,
          accessToken: gmail.accessToken,
        },
      });
      const templates = fs.readFileSync(
        `src/templates/${data.template}`,
        "utf-8"
      );
      const mailOptions = {
        from: '"RENTA" -- <vehiclerental10@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(templates, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }),
};
