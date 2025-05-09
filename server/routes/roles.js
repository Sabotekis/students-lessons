const express = require('express');
const router = express.Router();
const RoleService = require('../services/RoleService');
const checkPermission = require('../middleware/checkPermission');

router.get('/', async (req, res) => {
    try {
        const roles = await RoleService.getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/', checkPermission('roles.create'), async (req, res) => {
    try {
        const { name, permissions, sections } = req.body;
        const role = await RoleService.createRole({ name, permissions, sections });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { permissions, sections } = req.body;
        const role = await RoleService.updateRole({ id: req.params.id, permissions, sections });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/permissions', async (req, res) => {
    try {
        const permissions = await RoleService.getPermissionsByRoleId({ roleId: req.user.role });
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/sections', async (req, res) => {
    try {
        const role = req.user.role;
        const roleData = await RoleService.getRoleById({ id: role });
        if (!roleData) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(roleData.sections);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

module.exports = router;