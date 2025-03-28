const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    personal_code: { type: String, required: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
    attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
    licence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Licence' }],
    licenceRegistration: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LicenceRegistration' }],
    total_academic_hours: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);