const express = require('express')
const scheduleRouter = express.Router()
const ScheduleController = require('../controllers/schedule.controller.js')

scheduleRouter.post('/', ScheduleController.create)
scheduleRouter.get('/:id', ScheduleController.show)
scheduleRouter.get('/', ScheduleController.index)

module.exports = scheduleRouter
