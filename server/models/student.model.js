const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    personalCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    totalAcademicHours: { type: Number, default: 0 },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
    attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
    certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }],
    deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);