const jwt = require('jsonwebtoken')

const Auth = (req, res, next) => {
    if (req.cookies && req.cookies.usertoken) {
        jwt.verify(req.cookies.usertoken, process.env.JWT_SECRET, (err, data) => {
            req.user = data
            next()
        })
    } else {
        next()
    }
}

module.exports = Auth