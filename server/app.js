const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const http = require('http')

const races = require('./routes/api/races')
const auth = require('./routes/api/auth')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use('/api/auth', auth)
app.use('/api/races', races)

// Handle production
if (process.env.NODE_ENV === 'production') {
    // Static folder
    app.use(express.static(__dirname + '/public/'))

    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

const port = process.env.PORT || 5000
const server = http.createServer(app)

server.listen(port, console.log(`server runs on port ${port}`))

mongoose.connect('mongodb+srv://restrace:restrace@restrace-x7une.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
})

const io = require('socket.io')(server)
require('./middleware/sockets')(io)

module.exports = app