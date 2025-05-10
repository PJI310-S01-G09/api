const moment = require("moment");

const currentDate = () => moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = {
  currentDate,
};
