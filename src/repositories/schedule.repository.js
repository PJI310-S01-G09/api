const db = require("../db/conn.js");
const { mapScheduleFields } = require("../validators/schedule.validator.js");
const tableName = "schedule";

const ScheduleRepository = {
  create: async (schedule) => {
    const { clientId, scheduledAt, serviceDuration, ...scheduleData } =
      schedule;
    const [id] = await db(tableName).insert({
      ...scheduleData,
      client_id: clientId,
      scheduled_at: scheduledAt,
      service_duration: serviceDuration,
    });
    return { id, ...schedule };
  },
  update: async (id, schedule) => {
    const updatedSchedule = await db(tableName)
      .where({ id })
      .update(schedule)
      .returning("*");
    return updatedSchedule;
  },
  show: async (id) => {
    const schedule = await db(tableName).where({ id }).first();
    return mapScheduleFields(schedule);
  },
  index: async () => {
    const schedules = await db(tableName).select("*");
    return schedules.map(schedule => mapScheduleFields(schedule));
  },
  delete: async (id) => {
    const schedule = await db(tableName).where({ id }).del();
    return schedule;
  },
  findConflict: async (start, end) => {
    return await db(tableName)
      .whereRaw(
        "scheduled_at < ? AND DATE_ADD(scheduled_at, INTERVAL service_duration MINUTE) > ?",
        [end, start]
      )
      .first();
  },
};

module.exports = ScheduleRepository;
