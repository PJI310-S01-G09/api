const express = require('express')
const clientRouter = express.Router()
const ClientController = require('../controllers/client.controller.js')

clientRouter.post('/', ClientController.create)
clientRouter.get('/:id', ClientController.show)
clientRouter.get('/', ClientController.index)

module.exports = clientRouter
