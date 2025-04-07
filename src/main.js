const express = require('express')
const userRouter = require('./routes/user.route.js')

const app = express()
app.use(express.json())

app.use('/users', userRouter)
app.get('/', (req, res) => {
  res.send({msg: 'Hello World !!'})
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})
