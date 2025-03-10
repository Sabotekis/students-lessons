const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('AccessToken', accessTokenSchema);