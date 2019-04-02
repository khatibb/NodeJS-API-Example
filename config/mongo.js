const mongoose = require('mongoose')

module.exports = (URL) => {
  mongoose.connect(URL, { useNewUrlParser: true, useCreateIndex: true })
  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))

  db.once('open', () => {
    console.log('Connected to MongoDB on ' + URL)
  })
}