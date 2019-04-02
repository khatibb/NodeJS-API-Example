
require('dotenv').config()
const connectToMongo = require('./config/mongo')
const startServer = require('./config/server')

connectToMongo(process.env.MONGO_URL || 'mongodb://localhost/coligo')
startServer(process.env.PORT || 5000)