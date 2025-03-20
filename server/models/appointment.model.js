const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  time_minute: { type: Number, required: true },
  academic_hours: { type: Number, required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);