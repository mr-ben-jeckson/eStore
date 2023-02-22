const redis = require('../utils/redis');
const jwt = require('jsonwebtoken');

const chatToken = async(socket, next) => {
    let token = socket.handshake.query.token;
    if(token) {
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(decoded) {
            let user = await redis.get(decoded._id);
            if(user) {
                socket.userPayload = user;
                next();
            } else {
                next(new Error("Tokenization Error"));
            }
        } else {
            next(new Error("Token cannot be verified"));
        }
    } else {
        next(new Error("Socket Query Token Invalid"));
    }
}

const liveUser = async(socketId, user) => {
    user['socketId'] = socketId;
    redis.set(socketId, user._id);
    redis.set(user._id, user);
}

const initialize = async(io, socket) => {
    socket['currentUserId'] = socket.userPayload._id;
    await liveUser(socket.id, socket.userPayload);
}

module.exports = {
    chatToken,
    initialize
}