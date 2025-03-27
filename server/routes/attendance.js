const express = require('express');
const router = express.Router();
const AttendanceService = require('../services/AttendanceService');
const Attendance = require('../models/attendance.model');

router.post('/', async (req, res) => {
    try {
        const attendance = await AttendanceService.addAttendance({ attendanceData: req.body });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message }); 
    }
});

router.get('/history/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const attendances = await Attendance.find({ student: studentId })
            .populate({
                path: 'session',
                populate: {
                    path: 'group',
                    select: 'title'
                }
            })
            .populate('student');
        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = router;