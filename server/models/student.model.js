const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    personal_code: { type: String, required: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
    appointment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    licence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Licence' }],
    licenceRegistration: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LicenceRegistration' }],
});

module.exports = mongoose.model('Student', studentSchema);