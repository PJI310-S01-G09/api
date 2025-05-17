const dotenv = require('dotenv')
const app = require('./app.js')
const { currentDate } = require('./utils/currentDate.js')
dotenv.config()

const {
    PORT
} = process.env

const appPort = Number(PORT) || 3000

app.listen(appPort, () => {
    console.log(`[${currentDate()}] Server is running on http://localhost:${appPort}`)
})
