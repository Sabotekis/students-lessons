const Attendance = require('../models/attendance.model');
const Student = require('../models/student.model');

class AttendanceService {
    static async addAttendance({ attendanceData }) {
        const { studentId, sessionId } = attendanceData;

        const existingAttendance = await Attendance.findOne({ student: studentId, session: sessionId });
        if (existingAttendance) {
            throw new Error('Attendance already exists for this student and session');
        }

        const attendance = new Attendance({
            student: studentId,
            session: sessionId,
            time_minute: attendanceData.timeMinute,
            academic_hours: attendanceData.academicHours,
        });
        await attendance.save();

        const student = await Student.findById(studentId);
        if (student) {
            student.attendances.push(attendance._id);
            await student.save();
        }

        return attendance;
    }
}

module.exports = AttendanceService;