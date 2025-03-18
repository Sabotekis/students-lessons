const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const StudentService = require('../services/StudentService');

router.get('/', async (req, res) => {
    try {
        const students = await StudentService.getAllStudents();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const student = await StudentService.getStudentById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student', error: error.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const newStudent = await StudentService.createStudent(req.body);
        res.status(200).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating student', error: error.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedStudent = await StudentService.updateStudent(req.params.id, req.body);
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await StudentService.deleteStudent(req.params.id);
        res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
});

module.exports = router;