const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const GroupService = require('../services/GroupService');

router.get('/', async (req, res) => {
    try {
        const groups = await GroupService.getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching groups', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const group = await GroupService.getGroupById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching group', error: error.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const newGroup = await GroupService.createGroup(req.body);
        res.status(200).json(newGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedGroup = await GroupService.updateGroup(req.params.id, req.body);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error updating group', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await GroupService.deleteGroup(req.params.id);
        res.status(200).json({ message: 'Group deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting group', error: error.message });
    }
});

router.post('/:id/add-student', authMiddleware, async (req, res) => {
    try {
        const updatedGroup = await GroupService.addStudentToGroup(req.params.id, req.body.studentId);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error adding student to group', error: error.message });
    }
});

router.post('/:id/remove-student', authMiddleware, async (req, res) => {
    try {
        const updatedGroup = await GroupService.removeStudentFromGroup(req.params.id, req.body.studentId);
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error removing student from group', error: error.message });
    }
});

module.exports = router;