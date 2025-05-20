const express = require('express');
const msal = require('@azure/msal-node');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const router = express.Router();

const msalConfig = {
  auth: {
    clientId: process.env.MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.MSAL_TENANT_ID}`,
    clientSecret: process.env.MSAL_CLIENT_SECRET,
  }
};
const cca = new msal.ConfidentialClientApplication(msalConfig);

router.post('/login', async (req, res) => {
  const { code } = req.body;
  try {
    const tokenResponse = await cca.acquireTokenByCode({
      code,
      redirectUri: process.env.MSAL_REDIRECT_URI,
      scopes: ["user.read", "openid", "profile", "email"]
    });

    const { preferred_username: email, name } = tokenResponse.idTokenClaims;

    // Find or create user in your DB
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, username: name });
      await user.save();
    }

    // Create your own JWT for session
    const appToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '4h' });

    res.cookie('token', appToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
      path: '/',
    });

    res.status(200).json({ status: "success", data: null, message: 'Logged in with Microsoft' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: "error", message: "MSAL login failed" });
  }
});

module.exports = router;