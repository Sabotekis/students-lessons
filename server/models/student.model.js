const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    ID: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    personal_code: { type: String, required: true },
    group: { type: String, required: true },
});

module.exports = mongoose.model('Student', studentSchema);