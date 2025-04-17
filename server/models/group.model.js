const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  registerNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  professor: { type: String, required: true },
  academicHours: { type: Number, required: true },
  minHours: { type: Number, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }],
  deleted: { type: Boolean, default: false },
  plannedData: { type: Map, of: { days: Number, hours: Number } }, 
  certificateCounter: { type: Number, default: 0 },
});

module.exports = mongoose.model('Group', groupSchema);