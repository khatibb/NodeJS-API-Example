const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
 const routes = require('../routes/index')

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())
app.use(routes)

const superSecret = 'tmp'
app.set('superSecret', process.env.APP_SECRET || superSecret)


module.exports = app