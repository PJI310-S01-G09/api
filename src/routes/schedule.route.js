const express = require('express')
const scheduleRouter = express.Router()
const ScheduleController = require('../controllers/schedule.controller.js')

scheduleRouter.post('/', ScheduleController.create)

module.exports = scheduleRouter
