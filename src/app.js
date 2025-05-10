const express = require('express')
const userRouter = require('./routes/user.route.js')
const clientRouter = require('./routes/client.route.js')
const scheduleRouter = require('./routes/schedule.route.js')
const authRouter = require('./routes/auth.route.js')
const { currentDate } = require('./utils/currentDate.js')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${currentDate()}] ${req.method} ${req.originalUrl}`)
  next()
})
app.use('/users', userRouter)
app.use('/clients', clientRouter)
app.use('/schedule', scheduleRouter)
app.use('/auth', authRouter)
app.get('/', (req, res) => {
  res.send({msg: 'Hello World !!'})
})

module.exports = app
