const ScheduleRepository = require('../repositories/schedule.repository.js')
const { createScheduleSchema, ScheduleErrorsMap, validateScheduleError } = require('../validators/schedule.validator.js')

const errorName = 'ScheduleServiceError'

const ScheduleService = {
    create: async (schedule) => {
        try {
            const scheduleToCreate = await createScheduleSchema.validate(schedule)
            const newSchedule = await ScheduleRepository.create(scheduleToCreate)
            return [newSchedule, null]
        } catch (error) {
            console.error(errorName, error)
            const errorMessage = validateScheduleError(error)
            return [null, errorMessage || [ScheduleErrorsMap.ErrorCreationSchedule]]
        }
    }
}

module.exports = ScheduleService
