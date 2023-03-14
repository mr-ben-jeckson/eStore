const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports = {
    /* Encode Password Function */
    encode: payload => bcrypt.hashSync(payload),

    /* Password Check Function */
    comparePass: (plain, hash) => bcrypt.compareSync(plain, hash),

    /* Json Formatted Message Function */
    fMsg: (res, msg = "", data = [], status = '' || 200) => res.status(status).json({ con: true, msg, data }),

    /* Making Collection to An Array */
    makeArray: (data = []) => { return data; },

    /* Creating Token */
    makeToken: (payload) => jwt.sign(payload, `${process.env.SECRET_KEY}`, { expiresIn: '6h' }),

    /* Sleep */
    sleep: (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}