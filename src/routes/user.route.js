const express = require('express')
const userRouter = express.Router()
const UserController = require('../controllers/user.controller.js')

userRouter.post('/', UserController.create)

module.exports = userRouter
