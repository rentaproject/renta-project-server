/* eslint-disable no-console */
const wrapper = require("../utils/wrapper");
const vehicleModel = require("../models/vehicle");

module.exports = {
  getAllVehicles: async (request, response) => {
    try {
      let { limit, page, keyword, orderBy, orderType, location } =
        request.query;
      page = Number(page) || 1;
      limit = Number(limit) || 5;
      keyword = keyword || "";
      orderBy = orderBy || "rentCount";
      location = location || "";
      orderType = orderType || "asc";

      if (
        orderType.toLowerCase() !== "asc" &&
        orderType.toLowerCase() !== "desc"
      ) {
        orderType = "asc";
      }

      const offset = page * limit - limit;
      // console.log(offset);
      const result = await vehicleModel.getAllVehicles(
        keyword,
        limit,
        offset,
        orderBy,
        orderType,
        location
      );

      if (result.rows.length < 1) {
        return wrapper.response(response, 404, "No data found", []);
      }
      return wrapper.response(
        response,
        200,
        "Success get all vehicle",
        result.rows
      );
    } catch (error) {
      console.log(error);
      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
  getVehicleById: async (request, response) => {
    try {
      const { id } = request.params;

      const result = await vehicleModel.getVehicleById(id);

      if (result.rowCount < 1) {
        return wrapper.response(response, 404, "no data found", []);
      }
      return wrapper.response(
        response,
        200,
        "Success get vehicle data",
        result.rows
      );
    } catch (error) {
      console.log(error);

      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
  addNewVehicle: async (request, response) => {
    try {
      const { typeId, name, status, price, stock, description, rentCount } =
        request.body;

      // const image1 = request.files.image1[0].filename;
      // const image2 = request.files.image2[0].filename;
      // const image3 = request.files.image3[0].filename;

      const data = {
        typeId,
        name,
        status,
        price,
        stock,
        description,
        rentCount,
        image1: !request.files.image1 ? "" : request.files.image1[0].filename,
        image2: !request.files.image2 ? "" : request.files.image2[0].filename,
        image3: !request.files.image3 ? "" : request.files.image3[0].filename,
      };

      console.log(data);
      const result = await vehicleModel.addNewVehicle(data);
      // console.log(result);
      return wrapper.response(
        response,
        200,
        "success create data",
        result.rows
      );
    } catch (error) {
      console.log(error);
      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
  getVehicleByType: async (request, response) => {
    try {
      const { id } = request.params;
      let { page, limit } = request.query;

      page = Number(page) || 1;
      limit = Number(limit) || 5;

      const offset = page * limit - limit;

      const result = await vehicleModel.getVehicleByType(id, offset, limit);

      if (result.rows.length < 1) {
        return wrapper.response(response, 404, "No data found", []);
      }

      return wrapper.response(response, 200, "Success get data", result.rows);
    } catch (error) {
      console.log(error);

      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
  updateVehicle: async (request, response) => {
    try {
      const { typeId, name, status, price, stock, description, rentCount } =
        request.body;
      const { id } = request.params;
      const setData = {
        typeId,
        name,
        status,
        price,
        stock,
        description,
        rentCount,
        id,
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await vehicleModel.updateVehicle(setData);

      return wrapper.response(
        response,
        200,
        "Success update data",
        result.rows
      );
    } catch (error) {
      console.log(error);

      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
  updateReservationVehicle: async (request, response) => {
    try {
      const { stock } = request.body;
      const { id } = request.params;
      const setData = {
        stock,
        id,
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await vehicleModel.updateReservationVehicle(setData);

      return wrapper.response(
        response,
        200,
        "Success update data reserved vehicle",
        result.rows
      );
    } catch (error) {
      console.log(error);

      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
  updateReturnVehicle: async (request, response) => {
    try {
      const { stock } = request.body;
      const { id } = request.params;
      const setData = {
        stock,
        id,
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await vehicleModel.updateReturnVehicle(setData);

      return wrapper.response(
        response,
        200,
        "Success update data return vehicle",
        result.rows
      );
    } catch (error) {
      console.log(error);

      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
  deleteVehicle: async (request, response) => {
    try {
      const { id } = request.params;

      const checkData = await vehicleModel.getVehicleById(id);

      if (!checkData.rowCount) {
        return wrapper.response(
          response,
          404,
          "No data found with given ID",
          null
        );
      }

      await vehicleModel.deleteVehicle(id);

      return wrapper.response(response, 204, "Success delete data", []);
    } catch (error) {
      console.log(error);
      return wrapper.response(response, 500, "Internal Server Error", null);
    }
  },
};
