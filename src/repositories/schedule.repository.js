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
    const schedule = await db(tableName)
      .leftJoin("clients", "schedule.client_id", "clients.id")
      .where("schedule.id", id)
      .select(
        "schedule.*",
        "clients.id as client_id",
        "clients.name as client_name",
        "clients.email as client_email",
        "clients.phone as client_phone",
        "clients.cpf as client_cpf",
        "clients.created_at as client_created_at",
        "clients.updated_at as client_updated_at"
      )
      .orderBy('schedule.scheduled_at', 'asc')
      .first();
  
    return mapScheduleFields(schedule);
  },
  index: async () => {
    const schedules = await db(tableName)
      .leftJoin("clients", "schedule.client_id", "clients.id")
      .select(
        "schedule.*",
        "clients.id as client_id",
        "clients.name as client_name",
        "clients.email as client_email",
        "clients.phone as client_phone",
        "clients.cpf as client_cpf",
        "clients.is_whatsapp as client_is_whatsapp",
        "clients.created_at as client_created_at",
        "clients.updated_at as client_updated_at"
      );
  
    return schedules.map(mapScheduleFields);
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
