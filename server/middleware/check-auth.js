const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'THIS_IS_THE_SECRET_KEY_123_456_789');
        req.userData = decoded;
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Authorization failed'
        })
    }
}