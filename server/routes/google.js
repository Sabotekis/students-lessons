const express = require('express');
const router = express.Router();
const GoogleService = require('../services/GoogleService');

router.get('/', async (req, res) => {
    res.status(200).json({ status: "success", data: null, message: "Veiksmīgi atgriezti dati" });
});

router.post('/create-tokens', async (req, res) => {  
    try {
        const tokens = await GoogleService.getTokens({ code: req.body.code });
        console.log('Tokens:', tokens);
        res.status(200).json(tokens);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/create-event', async (req, res) => {
    try {
        const result = await GoogleService.synchroniseEvents();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = router;