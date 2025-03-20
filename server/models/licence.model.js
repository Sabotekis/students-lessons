const mongoose = require('mongoose');

const licenceSchema = new mongoose.Schema({
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  end_date: { type: Date, required: true },
  statuss: { type: String, required: true }
});

module.exports = mongoose.model('Licence', licenceSchema);