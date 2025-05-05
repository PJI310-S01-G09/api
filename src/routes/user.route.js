const express = require('express')
const userRouter = express.Router()
const UserController = require('../controllers/user.controller.js')
const authMiddleware = require('../middlewares/auth.middleware.js')

userRouter.post('/', authMiddleware, UserController.create)

module.exports = userRouter
