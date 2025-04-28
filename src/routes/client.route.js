const express = require('express')
const clientRouter = express.Router()
const ClientController = require('../controllers/client.controller.js')

clientRouter.post('/', ClientController.create)

module.exports = clientRouter
