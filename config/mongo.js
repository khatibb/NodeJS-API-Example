/* eslint-disable no-console */
const mongoose = require('mongoose')
module.exports = async (URL) => {

    try {

        mongoose.connect(URL, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        const db =  mongoose.connection


        await db.once('open', () => {

            console.log('Connected to MongoDB on ' + URL)

        })
    
    }
    catch (error) {

        console.error.bind(console, 'connection error:')

    }

}