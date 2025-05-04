const ScheduleService = require('../services/schedule.service.js')

const ScheduleController = {
    create: async (req, res) => {
        const [schedule, error] = await ScheduleService.create(req.body)
        if (!schedule) {
            return res.status(500).json({ error })
        }
        return res.status(201).json(schedule)
    },
    show: async (req, res) => {
        const { id } = req.params
        const [schedule, error] = await ScheduleService.show(id)
        if (!schedule) {
            return res.status(404).json({ error })
        }
        return res.status(200).json(schedule)
    },
    index: async (req, res) => {
        const [schedules, error] = await ScheduleService.index()
        if (!schedules) {
            return res.status(500).json({ error })
        }
        return res.status(200).json(schedules)
    },
}

module.exports = ScheduleController
