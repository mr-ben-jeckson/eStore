const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
    from: { type: Schema.Types.ObjectId, required: true, 'ref': 'user'},
    to: { type: Schema.Types.ObjectId, required: true, 'ref': 'user'},
    type: { type: String, enum: ["text", "message"], required: true},
    message: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

const chat = mongoose.model('chat', chatSchema);
module.exports = chat;
