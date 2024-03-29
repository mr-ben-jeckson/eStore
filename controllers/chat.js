const redis = require('../utils/redis');
const jwt = require('jsonwebtoken');
const chatDB = require('../models/chat');
const inboxDB = require('../models/inbox');

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
    socket.on('message', data => incomingMessage(io, socket, data));
    socket.on('unseen', data => loadUnseenInbox(socket));
    socket.on('load-unseen', data => loadUnseenChat(socket, data));
}

const loadUnseenChat = async(socket, data) => {
    let limit = Number(process.env.CHAT_LIMIT);
    let skip = Number(data.page) == 1 ? 0 : (Number(data.page) - 1);
    let skipCount = skip * limit;
    let chats = await chatDB.find({
        $or: [
            { from: socket.currentUserId },
            { to: socket.currentUserId }
        ]
    }).sort({ created : -1 }).skip(skipCount).limit(limit).populate('from to', '_id name');
    socket.emit('messages', chats);
}

const loadUnseenInbox = async(socket) => {
    let unseen = await inboxDB.find({ to: socket.currentUserId });
    if( unseen.length > 0) {
        unseen.forEach(async(item) => {
            await inboxDB.findByIdAndDelete(item._id);
        })
    }
    socket.emit('unseen', { msg: unseen.length })
}

const incomingMessage = async(io, socket, data, next) => {
    let saveChat = await chatDB(data).save();
    let newChat = await chatDB.findById(saveChat._id).populate('from to', '_id name');
    let toUser = await redis.get(newChat.to._id);
    if(toUser) {
        let toScoket = io.of('/chat').to(toUser.socketId);
        if(toScoket) {
            toScoket.emit('message', newChat);
        } else {
            next(new Error('Socket Not Found'));
        }
    } else {
        await new inboxDB({ from: newChat.from._id, to: newChat.to._id}).save();
    }
    socket.emit('message', newChat);
}
module.exports = {
    chatToken,
    initialize
}