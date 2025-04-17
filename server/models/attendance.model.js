const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  timeMinute: { type: Number, required: true },
  academicHours: { type: Number, required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);