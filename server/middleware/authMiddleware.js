const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    console.log('No token provided'); 
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    console.log('Invalid token'); 
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;