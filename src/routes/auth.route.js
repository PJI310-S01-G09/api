const express = require('express')
const authRouter = express.Router()
const AuthController = require('../controllers/auth.controller.js')

authRouter.post('/login', AuthController.login)

module.exports = authRouter
