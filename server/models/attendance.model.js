const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  time_minute: { type: Number, required: true },
  academic_hours: { type: Number, required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);