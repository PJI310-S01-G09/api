const ScheduleService = require('../services/schedule.service.js')

const ScheduleController = {
    create: async (req, res) => {
        const [schedule, error] = await ScheduleService.create(req.body)
        if (!schedule) {
            return res.status(500).json({ error })
        }
        return res.status(201).json(schedule)
    }
}

module.exports = ScheduleController
