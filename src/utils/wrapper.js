module.exports = {
  response: (response, status, msg, data, pagination) => {
    const result = {
      status,
      msg,
      data, // data: data
      pagination, // pagination : pagination
    };
    return response.status(status).json(result);
  },
};
