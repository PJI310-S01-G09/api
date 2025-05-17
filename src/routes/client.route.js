const express = require('express')
const clientRouter = express.Router()
const ClientController = require('../controllers/client.controller.js')
const authMiddleware = require('../middlewares/auth.middleware.js')

clientRouter.post('/', authMiddleware, ClientController.create)
clientRouter.get('/:id', authMiddleware, ClientController.show)
clientRouter.get('/', authMiddleware, ClientController.index)

module.exports = clientRouter
