const express = require('express');
const router = express.Router();
const AttendanceService = require('../services/AttendanceService');

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
        const attendances = await AttendanceService.getAttendanceHistory({ studentId: req.params.studentId });
        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = router;