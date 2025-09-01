const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');
const checkPermission = require('../middleware/checkPermission');

router.get('/', async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.put('/:id/assign-role', checkPermission('roles.assign'), async (req, res) => {
    try {
        const { roleId } = req.body;
        const user = await UserService.assignRoleToUser({ userId: req.params.id, roleId });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.put('/:id/tag', async (req, res) => {
    try {
        const { tagId } = req.body;
        const user = await UserService.assignTagToUser({ userId: req.params.id, tagId });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.get('/by-tag/:tagId', async (req, res) => {
    try {
        const { tagId } = req.params;
        const users = await UserService.getUsersByTagId({ tagId });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.post('/coordinates', async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log(`Received coordinates: Latitude ${latitude}, Longitude ${longitude}`);
    res.status(200).json({ status: "success", message: "Coordinates received" });
});

module.exports = router;