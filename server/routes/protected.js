const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const AccessTokensService = require('../services/AccessTokensService');
const router = express.Router();

router.use(authMiddleware);

router.get('/protected', async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.email) {
      throw new Error('Email is required for token retrieval');
    }

    const token = await AccessTokensService.getToken({ email: user.email });
    
    res.status(200).json({ status: "success", data: { token }, message: 'Veiksmīgi atgriezti dati', user });
  } catch (err) {
    console.error('Error retrieving token:', err);
    res.status(500).json({ status: "error", data: null, message: 'Server error' });
  }
});

module.exports = router;