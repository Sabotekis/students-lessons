const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
});

module.exports = mongoose.model('Session', sessionSchema);