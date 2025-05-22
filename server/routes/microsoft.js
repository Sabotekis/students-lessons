const express = require('express');
const router = express.Router();
const MicrosoftService = require('../services/MicrosoftService');
const checkPermission = require('../middleware/checkPermission');

router.post('/create-event', checkPermission('sessions.microsoft'), async (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ status: "error", data: null, message: error.message });

    try {
        await MicrosoftService.synchroniseEvents(accessToken);
        res.status(200).json({ status: "success", data: null, message: "Veiksmīgi atgriezti dati" });
    } catch (err) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

module.exports = router;