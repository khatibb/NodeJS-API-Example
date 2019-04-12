/* eslint-disable no-console */
const app = require('./app')

module.exports = (port) => {

    app.listen(port, () => {

        console.log(`Listening on port ${port}`)
    
    })

}