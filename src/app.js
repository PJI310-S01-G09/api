const express = require('express')
const userRouter = require('./routes/user.route.js')
const clientRouter = require('./routes/client.route.js')

const app = express()
app.use(express.json())

app.use('/users', userRouter)
app.use('/clients', clientRouter)
app.get('/', (req, res) => {
  res.send({msg: 'Hello World !!'})
})

module.exports = app
