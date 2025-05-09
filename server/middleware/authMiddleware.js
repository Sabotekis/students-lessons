const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users.model'); 

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    console.log('No token provided'); 
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('role'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = { ...decoded, role: user.role };
    next();
  } catch (ex) {
    if (ex.name === 'TokenExpiredError') {
      console.log('Token expired');
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    console.log('Invalid token');
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;