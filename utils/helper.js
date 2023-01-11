module.exports = {
    //Json Formatted Message Function
    fMsg: (res, msg = "", result = []) => res.status(200).json({ con: true, msg, result })
}