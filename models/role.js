const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
    name: { type: String, required: true },
    permissions: [{ type: Schema.Types.ObjectId, 'ref': 'permission' }]
});

const role = mongoose.model('role', roleSchema);
module.exports = role;
