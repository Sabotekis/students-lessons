const express = require('express');
const router = express.Router();
const GroupService = require('../services/GroupService');

router.get('/', async (req, res) => {
    try {
        const groups = await GroupService.getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const group = await GroupService.getGroupById({id: req.params.id});
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newGroup = await GroupService.createGroup({groupData: req.body});
        res.status(200).json(newGroup);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedGroup = await GroupService.updateGroup({id: req.params.id, groupData: req.body});
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await GroupService.deleteGroup({id: req.params.id});
        res.status(200).json({ status: "success", data: null, message: 'Veiksmīgi atgriezti dati' });
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/:id/add-student', async (req, res) => {
    try {
        const updatedGroup = await GroupService.addStudentToGroup({ groupId: req.params.id, studentId: req.body.studentId });
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/:id/remove-student', async (req, res) => {
    try {
        const updatedGroup = await GroupService.removeStudentFromGroup({ groupId: req.params.id, studentId: req.body.studentId });
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/:groupId/report', async (req, res) => {
    try {
        const report = await GroupService.generateGroupReport({ groupId: req.params.groupId });
        res.json(report);
    } catch (error) {
        console.error("Error generating group report:", error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:groupId/register', async (req, res) => {
    try {
        const register = await GroupService.generateGroupRegister({ groupId: req.params.groupId });
        res.json(register);
    } catch (error) {
        console.error("Error generating group register:", error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;