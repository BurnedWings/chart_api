const jwt = require('./jwt')
const { jwtSecret } = require('../config/config.default')

module.exports = async (data) => {
    const ret = await jwt.sign(data, jwtSecret)
    return ret
}

