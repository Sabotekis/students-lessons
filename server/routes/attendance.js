const express = require('express');
const router = express.Router();
const AttendanceService = require('../services/AttendanceService');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', async (req, res) => {
    try {
        const attendance = await AttendanceService.addAttendance({ attendanceData: req.body });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(400).json({ status: "error", data: null, message: error.message }); 
    }
});

router.get('/history/:studentId', async (req, res) => {
    try {
        const attendances = await AttendanceService.getAttendanceHistory({ studentId: req.params.studentId });
        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/upload-csv', upload.single('file'), async (req, res) => {
    try {
        const { meetingTitle, startTime, presenters } = await AttendanceService.processCsv({filePath: req.file.path});
        res.status(200).json({ meetingTitle, startTime, presenters });
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message });
    }
});

router.post('/upload-attendance', async (req, res) => {
    try {
        const { meetingTitle, startTime, presenters } = req.body;
        await AttendanceService.uploadAttendance({ meetingTitle, startTime, presenters });
        res.status(200).json({ status: "success", data: null, message: "Veiksmīgi atgriezti dati" });
    } catch (error) {
        res.status(500).json({ status: "error", data: null, message: error.message  });
    }
});

router.get('/report/html/:groupId/:month', async (req, res) => {
    const { groupId, month } = req.params;

    try {
        const report = await AttendanceService.getAttendanceReport({ groupId, month });
        res.json(report);
    } catch (error) {
        console.error('Error fetching attendance report:', error.message);
        res.status(404).json({ message: 'Attendance report not found' });
    }
});

module.exports = router;