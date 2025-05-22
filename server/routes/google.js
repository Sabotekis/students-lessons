const express = require('express');
const router = express.Router();
const GoogleService = require('../services/GoogleService');
const checkPermission = require('../middleware/checkPermission');

router.get('/', async (req, res) => {
    res.status(200).json({ status: "success", data: null, message: "Veiksmīgi atgriezti dati" });
});

router.post('/create-tokens', checkPermission('sessions.google'), async (req, res) => {  
    try {
        const tokens = await GoogleService.getTokens({ code: req.body.code });
        res.status(200).json(tokens);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/create-event', checkPermission('sessions.google'), async (req, res) => {
    try {
        const result = await GoogleService.synchroniseEvents();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

module.exports = router;