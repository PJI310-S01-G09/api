const express = require('express')
const scheduleRouter = express.Router()
const ScheduleController = require('../controllers/schedule.controller.js')
const authMiddleware = require('../middlewares/auth.middleware.js')

scheduleRouter.post('/', ScheduleController.create)
scheduleRouter.get('/free-hours', ScheduleController.freeHours)
scheduleRouter.get('/:id', authMiddleware, ScheduleController.show)
scheduleRouter.get('/', authMiddleware, ScheduleController.index)

module.exports = scheduleRouter
