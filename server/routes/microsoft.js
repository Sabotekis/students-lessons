const express = require('express');
const router = express.Router();
const MicrosoftService = require('../services/MicrosoftService');

router.post('/create-event', async (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: 'No access token' });

    try {
        await MicrosoftService.synchroniseEvents(accessToken);
        res.json({ message: 'Events synchronized with Microsoft Calendar' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;