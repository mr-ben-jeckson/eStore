module.exports = {
    fMsg: (res, msg = "", result = []) => res.status(200).json({ con: true, msg, result })
}