const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  professor: { type: String, required: true },
  academic_hours: { type: Number, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Group', groupSchema);