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
        (e) => e.date === dateStr && e.isOpen === false
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
      if (
        startMinutes < bhStartMinutes ||
        endMinutes > bhEndMinutes ||
        start.isBefore(moment())
      ) {
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
  freeHours: async () => {
    try {
      const availableDays = [];
      const today = moment().startOf("day");
      const daysToCheck = 20;
      const intervalMinutes = 30;

      const businessHoursList = await BusinessHoursRepository.show();
      const exceptions = await BusinessExceptionsRepository.show();
      const allSchedules = await ScheduleRepository.index();

      // Consider only schedules from today onward
      const futureScheduled = allSchedules.filter((s) =>
        moment(s.scheduledAt).isSameOrAfter(today, "day")
      );

      for (let i = 0; i < daysToCheck; i++) {
        const date = today.clone().add(i, "days");
        const dateStr = date.format("YYYY-MM-DD");
        const weekday = date.day();

        const isException = exceptions.find(
          (e) => e.date === dateStr && e.isOpen === false
        );
        if (isException) continue;

        const bh = businessHoursList.find((b) => b.weekday === weekday);
        if (!bh || !bh.isOpen) continue;

        const slots = [];
        const start = moment(
          `${dateStr} ${bh.startTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const end = moment(`${dateStr} ${bh.endTime}`, "YYYY-MM-DD HH:mm:ss");

        for (
          let slot = start.clone();
          slot.isBefore(end);
          slot.add(intervalMinutes, "minutes")
        ) {
          const slotStart = slot.clone();
          const slotEnd = slot.clone().add(intervalMinutes, "minutes");

          if (slotStart.isSame(today, "day") && slotStart.isBefore(moment()))
            continue;

          const conflict = futureScheduled.find((s) => {
            const scheduledStart = moment(s.scheduledAt);
            const scheduledEnd = scheduledStart
              .clone()
              .add(s.serviceDuration, "minutes");

            return (
              slotStart.isBefore(scheduledEnd) &&
              slotEnd.isAfter(scheduledStart)
            );
          });

          if (!conflict) {
            slots.push(slotStart.format("HH:mm"));
          }
        }

        if (slots.length > 0) {
          availableDays.push({ date: dateStr, slots: slots });
        }
      }

      return [availableDays, null];
    } catch (error) {
      console.error(errorName, error);
      return [null, [ScheduleMessageMap.ErrorShowSchedule]];
    }
  },
};

module.exports = ScheduleService;
