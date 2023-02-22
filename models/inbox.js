const mongoose = require('mongoose');
const { Schema } = mongoose;

const inboxSchema = new Schema({
    from: { type: Schema.Types.ObjectId, required: true, 'ref': 'user' },
    to: { type: Schema.Types.ObjectId, required: true, 'ref': 'user' },
});

const inbox = mongoose.model('inbox', inboxSchema);
module.exports = inbox;
