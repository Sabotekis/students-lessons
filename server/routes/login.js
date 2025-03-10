const express = require('express');
const AuthService = require('../services/AuthService');
const AccessTokensService = require('../services/AccessTokensService');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await AuthService.login({ email, password });
    await AccessTokensService.createToken({ email });

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
      path: '/',
    });

    res.status(200).json({ status: "success", data: null, message: 'Login successful' });
  } catch (err) {
    res.status(400).json({ status: "error", data: null, message: err.message });
  }
});

module.exports = router;