/* eslint-disable no-console */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const pool = require("./src/config/postgresql");
const routerNavigation = require("./src/routes");

const app = express();
const port = process.env.PORT || 3001;
pool
  .connect()
  .then(() => {
    console.log("db conected");
    app.use(cors());
    app.use(morgan("dev"));
    app.use(helmet());
    app.use(xss());
    app.use(compression());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
  })
  .catch((error) => console.log(error));

app.use("/api", routerNavigation);

app.use("/*", (req, res) => {
  res.status(404).send("Path Not Found !");
});

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
