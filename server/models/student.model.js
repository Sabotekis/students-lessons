const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    personal_code: { type: String, required: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
});

module.exports = mongoose.model('Student', studentSchema);