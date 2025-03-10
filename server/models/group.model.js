const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  ID: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  professor: { type: String, required: true },
});

module.exports = mongoose.model('Group', groupSchema);