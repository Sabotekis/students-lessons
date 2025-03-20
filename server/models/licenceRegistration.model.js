const mongoose = require('mongoose');

const licenceRegistrationSchema = new mongoose.Schema({
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  issue_date: { type: Date, required: true },
  licence_number: { type: String, required: true }
});

module.exports = mongoose.model('Licence Registration', licenceRegistrationSchema);