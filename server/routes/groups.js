const express = require('express');
const Group = require('../models/group.model');
const router = express.Router();

router.get('/', async (req, res) => {
    const groups = await Group.find();
    res.json(groups);
});

router.post('/', async (req, res) => {
    const newGroup = new Group(req.body);
    await newGroup.save();
    res.json(newGroup);
});

router.put('/:id', async (req, res) => {
    const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGroup);
});

router.delete('/:id', async (req, res) => {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: 'Group deleted' });
});

module.exports = router;