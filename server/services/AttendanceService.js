const Attendance = require('../models/attendance.model');
const Student = require('../models/student.model');
const Session = require('../models/session.model');

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
            student.total_academic_hours = Number(student.total_academic_hours || 0) + Number(attendanceData.academicHours);
            await student.save();
        }

        const session = await Session.findById(sessionId);
        if (session) {
            session.attendances.push(attendance._id);
            await session.save();
        }

        return attendance;
    }

    static async getAttendanceHistory({ studentId }) {
        return await Attendance.find({ student: studentId })
            .populate({
                path: 'session',
                populate: {
                    path: 'group',
                    select: 'title'
                }
            })
            .populate('student');
    }
}

module.exports = AttendanceService;