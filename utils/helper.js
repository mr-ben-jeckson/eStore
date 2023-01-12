const bcrypt = require('bcryptjs');
module.exports = {
    //Encode Password Function
    encode: payload => bcrypt.hashSync(payload),
    //Password Check Function
    comparePass: (plain, hash) => bcrypt.compareSync(plain, hash),
    //Json Formatted Message Function
    fMsg: (res, msg = "", result = []) => res.status(200).json({ con: true, msg, result })
}