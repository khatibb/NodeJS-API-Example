const _ = require('lodash')
//Compose middleware package can be used here later on to compose multiple middlewares into a single array 
const middleware = {
    // VERIFY USER LOGGED IN
    isLoggedIn: function (req, res, next) {
        var incomingToken = req.body.token || req.query.token || req.headers['x-fake-token']
    
        if (incomingToken) {
            let preDefinedToken =process.env.FAKE_TOKEN

            if (_.toString(incomingToken) === _.toString(preDefinedToken)) {
                req.decoded = incomingToken
                return next()
            }
            return res.status(401).json('Not Authorized..please try to login again')


        }
        return res.status(400).json('You cannot perform this action unless you are logged in')


    }
}

module.exports = middleware