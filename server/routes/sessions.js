const express = require('express');
const router = express.Router();
const SessionService = require('../services/SessionService');

router.put('/:id/finish', async (req, res) => {
    try {
        const session = await SessionService.getSessionById({ id: req.params.id });
        if (!session || session.deleted) {
            return res.status(400).json({ message: 'Cannot finish a deleted session' });
        }
        session.finished = true;
        await SessionService.updateSession({ id: req.params.id, sessionData: session });
        res.status(200).json({ status: "success", data: session, message: 'Session finished successfully' });
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        const sessions = await SessionService.getDeletedSessions();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const sessions = await SessionService.getAllSessions();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/finished', async (req, res) => {
    try {
        const sessions = await SessionService.getFinishedSessions();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/deleted', async (req, res) => {
    try {
        const sessions = await SessionService.getDeletedSessions();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const session = await SessionService.getSessionById({ id: req.params.id });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newSession = await SessionService.createSession({ sessionData: req.body });
        res.status(200).json(newSession);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedSession = await SessionService.updateSession({ id: req.params.id, sessionData: req.body });
        res.status(200).json(updatedSession);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const updatedSession = await SessionService.deleteSession({ id: req.params.id });
        res.status(200).json({ status: "success", data: updatedSession, message: 'Veiksmīgi atgriezti dati' });
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});


module.exports = router;