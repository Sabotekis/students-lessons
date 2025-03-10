const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const dotenv = require('dotenv');

dotenv.config();

class AuthService {
  static async login({ email, password }) {
    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);

    return { user, token };
  }
}

module.exports = AuthService;