module.exports = {
  dateTime: () => {
    const current = new Date();
    const cDate = `${current.getFullYear()}-${
      current.getMonth() + 1
    }-${current.getDate()}`;
    const cTime = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
    const dateTime = `${cDate} ${cTime}`;

    return dateTime;
  },
};
