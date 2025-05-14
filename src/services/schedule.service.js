const moment = require("moment");
const ScheduleRepository = require("../repositories/schedule.repository.js");
const ClientRepository = require("../repositories/client.repository.js");
const BusinessHoursRepository = require("../repositories/business_hours.repository.js");
const BusinessExceptionsRepository = require("../repositories/business_exceptions.repository.js");
const {
  createScheduleSchema,
  ScheduleMessageMap,
  validateScheduleError,
} = require("../validators/schedule.validator.js");

const errorName = "ScheduleServiceError";

const ScheduleService = {
  create: async (schedule) => {
    try {
      const scheduleToCreate = await createScheduleSchema.validate(schedule);

      const start = moment(scheduleToCreate.scheduledAt);
      const end = start
        .clone()
        .add(scheduleToCreate.serviceDuration, "minutes");

      // 1. Check for business exception (closed dates)
      const dateStr = start.format("YYYY-MM-DD");
      const exceptions = await BusinessExceptionsRepository.show();
      const isBlockedDate = exceptions.find(
        (e) => e.date === dateStr && e.is_open === false
      );
      if (isBlockedDate) {
        return [
          null,
          [ScheduleMessageMap.ErrorNotPermittedDueToBusinessClosed],
        ];
      }

      // 2. Check for weekday config
      const weekday = start.day(); // 0 = Sunday ... 6 = Saturday
      const businessHours = await BusinessHoursRepository.show();
      const dayConfig = businessHours.find((b) => b.weekday === weekday);

      if (!dayConfig || !dayConfig.isOpen) {
        return [
          null,
          [ScheduleMessageMap.ErrorNotPermittedDueToBusinessClosed],
        ];
      }

      // 3. Validate that schedule starts within working hours
      const businessStart = moment(dayConfig.startTime, "HH:mm:ss");
      const businessEnd = moment(dayConfig.endTime, "HH:mm:ss");

      const startMinutes = start.hours() * 60 + start.minutes();
      const bhStartMinutes =
        businessStart.hours() * 60 + businessStart.minutes();
      const bhEndMinutes = businessEnd.hours() * 60 + businessEnd.minutes();

      const endMinutes = end.hours() * 60 + end.minutes();
      if (startMinutes < bhStartMinutes || endMinutes > bhEndMinutes) {
        return [
          null,
          [ScheduleMessageMap.ErrorNotPermittedDueToOutsideBusinessHours],
        ];
      }

      // 4. Check for schedule conflict
      const conflict = await ScheduleRepository.findConflict(
        start.toDate(),
        end.toDate()
      );
      if (conflict) {
        return [
          null,
          [ScheduleMessageMap.ErrorNotPermittedScheduleDueToConflict],
        ];
      }

      // 5. Create or associate client
      let clientId = scheduleToCreate.clientId;
      if (!clientId && scheduleToCreate.client) {
        const createdOrUpdatedClient =
          await ClientRepository.createOrUpdateByCPFOrEmail(
            scheduleToCreate.client
          );
        clientId = createdOrUpdatedClient.id;
      }

      if (!clientId) {
        return [null, [ScheduleMessageMap.ErrorNotSentClient]];
      }

      // 6. Create schedule
      const newSchedule = await ScheduleRepository.create({
        clientId,
        scheduledAt: scheduleToCreate.scheduledAt,
        serviceDuration: scheduleToCreate.serviceDuration,
      });

      return [newSchedule, null];
    } catch (error) {
      console.error(errorName, error);
      const errorMessage = validateScheduleError(error);
      return [null, errorMessage || [ScheduleMessageMap.ErrorCreationSchedule]];
    }
  },
  show: async (id) => {
    try {
      const schedule = await ScheduleRepository.show(id);
      if (!schedule || schedule.length === 0) {
        return [null, [ScheduleMessageMap.ScheduleNotFound]];
      }
      return [schedule, null];
    } catch (error) {
      console.error(errorName, error);
      return [null, [ScheduleMessageMap.ErrorShowSchedule]];
    }
  },
  index: async () => {
    try {
      const schedules = await ScheduleRepository.index();
      return [schedules, null];
    } catch (error) {
      console.error(errorName, error);
      return [null, [ScheduleMessageMap.ErrorShowSchedule]];
    }
  },
};

module.exports = ScheduleService;
