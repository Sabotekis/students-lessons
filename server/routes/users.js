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

module.exports = router;