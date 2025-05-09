const express = require('express');
const router = express.Router();
const StudentService = require('../services/StudentService');
const checkPermission = require('../middleware/checkPermission');

router.get('/', async (req, res) => {
    try {
        const students = await StudentService.getAllStudents();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const student = await StudentService.getStudentById({ id: req.params.id });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/', checkPermission('students.create'), async (req, res) => {
    try {
        const newStudent = await StudentService.createStudent({ studentData: req.body });
        res.status(200).json(newStudent);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.put('/:id', checkPermission('students.update'), async (req, res) => {
    try {
        const updatedStudent = await StudentService.updateStudent({ id: req.params.id, studentData: req.body });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.delete('/:id', checkPermission('students.delete'), async (req, res) => {
    try {
        await StudentService.deleteStudent({ id: req.params.id });
        res.status(200).json({ status: "success", data: null, message: 'Veiksmīgi atgriezti dati' });
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

module.exports = router;