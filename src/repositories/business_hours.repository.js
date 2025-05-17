const db = require("../db/conn.js");
const tableName = "business_hours";

const BusinessHoursRepository = {
  update: async (weekday, businessHour) => {
    const update = await db(tableName)
      .where({ weekday })
      .update({
        start_time: businessHour.startTime,
        end_time: businessHour.endTime,
        is_open: businessHour.isOpen,
      })
      .returning("*");
    return update;
  },

  show: async () => {
    const query = db(tableName);

    const hours = await query.select("*");
    return hours.map((hour) => ({
      weekday: hour.weekday,
      startTime: hour.start_time,
      endTime: hour.end_time,
      isOpen: hour.is_open,
    }));
  },
};

module.exports = BusinessHoursRepository;
