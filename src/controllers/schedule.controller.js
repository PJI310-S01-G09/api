const ScheduleService = require('../services/schedule.service.js')
const { mountResponse } = require('../utils/mount_response.js')
const { ScheduleMessageMap } = require('../validators/schedule.validator.js')

const ScheduleController = {
    create: async (req, res) => {
        const [schedule, error] = await ScheduleService.create(req.body)
        if (!schedule) {
            return res.status(500).json(mountResponse(null, error))
        }
        return res.status(201).json(mountResponse(schedule, null, ScheduleMessageMap.SuccessoOnCreateSchedule))
    },
    show: async (req, res) => {
        const { id } = req.params
        const [schedule, error] = await ScheduleService.show(id)
        if (!schedule) {
            return res.status(404).json(mountResponse(null, error))
        }
        return res.status(200).json(mountResponse(schedule, null, ScheduleMessageMap.SuccessOnGetSchedule))
    },
    index: async (req, res) => {
        const [schedules, error] = await ScheduleService.index()
        if (!schedules) {
            return res.status(500).json(mountResponse(null, error))
        }
        return res.status(200).json(mountResponse(schedules, null, ScheduleMessageMap.SuccessOnGetSchedules))
    },
}

module.exports = ScheduleController
