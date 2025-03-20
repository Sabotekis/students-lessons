const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const SessionService = require('../services/SessionService');

router.get('/', async (req, res) => {
    try {
        const sessions = await SessionService.getAllSessions();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sessions', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const session = await SessionService.getSessionById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching session', error: error.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const newSession = await SessionService.createSession(req.body);
        res.status(200).json(newSession);
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedSession = await SessionService.updateSession(req.params.id, req.body);
        res.status(200).json(updatedSession);
    } catch (error) {
        res.status(500).json({ message: 'Error updating session', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await SessionService.deleteSession(req.params.id);
        res.status(200).json({ message: 'Session deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting session', error: error.message });
    }
});


module.exports = router;