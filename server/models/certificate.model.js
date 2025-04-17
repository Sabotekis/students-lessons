const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  issueData: { type: Date, required: true },
  certificateNumber: { type: String, required: true},
});

module.exports = mongoose.model('Certificate', certificateSchema);