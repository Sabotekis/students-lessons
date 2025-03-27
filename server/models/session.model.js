const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
  deleted: { type: Boolean, default: false },
  finished: { type: Boolean, default: false }
});

module.exports = mongoose.model('Session', sessionSchema);