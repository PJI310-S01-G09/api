const ScheduleRepository = require('../repositories/schedule.repository.js')
const ClientRepository = require('../repositories/client.repository.js')
const { createScheduleSchema, ScheduleMessageMap, validateScheduleError } = require('../validators/schedule.validator.js')

const errorName = 'ScheduleServiceError'

const ScheduleService = {
    create: async (schedule) => {
        try {
            const scheduleToCreate = await createScheduleSchema.validate(schedule)

            const start = new Date(scheduleToCreate.scheduledAt)
            const end = new Date(start.getTime() + scheduleToCreate.serviceDuration * 60000)

            const conflict = await ScheduleRepository.findConflict(start, end)
            if (conflict) {
                return [null, [ScheduleMessageMap.ErrorNotPermittedScheduleDueToConflict]]
            }

            let clientId = scheduleToCreate.clientId

            if (!clientId && scheduleToCreate.client) {
                const createdOrUpdatedClient = await ClientRepository.createOrUpdateByCPFOrEmail(scheduleToCreate.client)
                clientId = createdOrUpdatedClient.id
            }

            if (!clientId) {
                return [null, [ScheduleMessageMap.ErrorNotSentClient]]
            }

            const newSchedule = await ScheduleRepository.create({
                clientId,
                scheduledAt: scheduleToCreate.scheduledAt,
                serviceDuration: scheduleToCreate.serviceDuration
            })

            return [newSchedule, null]
        } catch (error) {
            console.error(errorName, error)
            const errorMessage = validateScheduleError(error)
            return [null, errorMessage || [ScheduleMessageMap.ErrorCreationSchedule]]
        }
    },
    show: async (id) => {
        try {
            const schedule = await ScheduleRepository.show(id)
            if (!schedule || schedule.length === 0) {
                return [null, [ScheduleMessageMap.ScheduleNotFound]]
            }
            return [schedule, null]
        } catch (error) {
            console.error(errorName, error)
            return [null, [ScheduleMessageMap.ErrorShowSchedule]]
        }
    },
    index: async () => {
        try {
            const schedules = await ScheduleRepository.index()
            return [schedules, null]
        } catch (error) {
            console.error(errorName, error)
            return [null, [ScheduleMessageMap.ErrorShowSchedule]]
        }
    },
}

module.exports = ScheduleService
