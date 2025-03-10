const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const AccessTokensService = require('../services/AccessTokensService');
const router = express.Router();

router.get('/protected', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.email) {
      throw new Error('Email is required for token retrieval');
    }

    const token = await AccessTokensService.getToken({ email: user.email });
    
    res.json({ status: "success", data: { token }, message: 'Veiksmīgi atgriezti dati', user });
  } catch (err) {
    console.error('Error retrieving token:', err);
    res.status(500).json({ status: "error", data: null, message: 'Server error' });
  }
});

module.exports = router;