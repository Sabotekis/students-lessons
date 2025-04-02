const Attendance = require('../models/attendance.model');
const Student = require('../models/student.model');
const Session = require('../models/session.model');
const fs = require('fs');
const csvParser = require('csv-parser');
const moment = require('moment');

class AttendanceService {
    static async addAttendance({ attendanceData }) {
        const { student, session, time_minute, academic_hours} = attendanceData;

        if (!student || !session || isNaN(time_minute) || isNaN(academic_hours)) {
            throw new Error('Invalid attendance data');
        }

        const existingAttendance = await Attendance.findOne({ student, session });
        if (existingAttendance) {
            throw new Error('Attendance already exists for this student and session');
        }

        const attendance = new Attendance({
            student,
            session,
            time_minute,
            academic_hours,
        });
        await attendance.save();

        const studentRecord = await Student.findById(student);
        if (studentRecord) {
            studentRecord.attendances.push(attendance._id);
            studentRecord.total_academic_hours = Number(studentRecord.total_academic_hours || 0) + academic_hours;
            await studentRecord.save();
        }

        const sessionRecord = await Session.findById(session);
        if (sessionRecord) {
            sessionRecord.attendances.push(attendance._id);
            await sessionRecord.save();
        }

        return attendance;
    }

    static async getAttendanceHistory({ studentId }) {
        const attendances = await Attendance.find({ student: studentId })
            .populate({
                path: 'session',
                populate: {
                    path: 'group',
                    select: 'title'
                }
            })
            .exec();

        return attendances;
    }

    static async processCsv({filePath}) {
        return new Promise((resolve, reject) => {
            const results = [];
            let isRelevantSection = false;
            let meetingTitle = '';
            let startTime = '';

            fs.createReadStream(filePath)
                .pipe(csvParser({ headers: false }))
                .on('data', (row) => {
                    const rowValues = Object.values(row).map(value => value.trim());

                    if (rowValues[0] === 'Meeting title') {
                        meetingTitle = rowValues[1];
                    }

                    if (rowValues[0] === 'Start time') {
                        startTime = rowValues[1];
                    }

                    if (rowValues[0] === '2. Participants') {
                        isRelevantSection = true;
                        return;
                    }

                    if (rowValues[0] === '3. In-Meeting Activities') {
                        isRelevantSection = false;
                        return;
                    }

                    if (isRelevantSection) {
                        const [name, firstJoin, lastLeave, , , , role] = rowValues;

                        if (name && firstJoin && lastLeave && role) {
                            results.push({
                                Name: name,
                                'First Join': firstJoin,
                                'Last Leave': lastLeave,
                                Role: role,
                            });
                        }
                    }
                })
                .on('end', () => {
                    const presenters = results.filter(row => row.Role === "Presenter").map(row => ({
                        name: row.Name,
                        firstJoin: row['First Join'],
                        lastLeave: row['Last Leave'],
                        role: row.Role,
                    }));

                    fs.unlinkSync(filePath);
                    resolve({ meetingTitle, startTime, presenters });
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    static async uploadAttendance({ meetingTitle, startTime, presenters }) {
        const formattedStartTime = moment(startTime, 'MM/DD/YY, h:mm:ss A').format('YYYY-MM-DD');
        if (!moment(formattedStartTime, 'YYYY-MM-DD', true).isValid()) {
            throw new Error('Invalid date format in startTime');
        }

        const sessions = await Session.find({ finished: true }).populate('group').populate('students');
        if (!sessions || sessions.length === 0) {
            throw new Error('No matching sessions found');
        }

        const matchingSession = sessions.find(session => {
            const sessionDateFormatted = moment(session.date).format('YYYY-MM-DD');
            return sessionDateFormatted === formattedStartTime && session.group.title === meetingTitle;
        });

        if (!matchingSession) {
            throw new Error('No matching session found');
        }

        const sessionStudentNames = matchingSession.students
            .filter(student => student && student.name && student.surname)
            .map(student => `${student.name.toLowerCase()} ${student.surname.toLowerCase()}`);

        const matchingPresenters = presenters.filter(presenter =>
            sessionStudentNames.includes(presenter.name.toLowerCase())
        );

        if (matchingPresenters.length === 0) {
            throw new Error('No matching presenters found');
        }

        for (const presenter of matchingPresenters) {
            const [presenterFirstName, presenterLastName] = presenter.name.split(' ');
            const student = await Student.findOne({ name: presenterFirstName, surname: presenterLastName });
            if (!student) {
                console.error(`Student not found for presenter: ${presenter.name}`);
                continue;
            }

            const firstJoinTime = moment(presenter.firstJoin, 'MM/DD/YY, h:mm:ss A');
            const lastLeaveTime = moment(presenter.lastLeave, 'MM/DD/YY, h:mm:ss A');
            if (!firstJoinTime.isValid() || !lastLeaveTime.isValid()) {
                console.error('Invalid date format for presenter:', presenter);
                continue;
            }

            const timeInMinutes = lastLeaveTime.diff(firstJoinTime, 'minutes');
            if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
                console.error('Invalid time calculation for presenter:', presenter);
                continue;
            }

            const academicHours = Math.floor(timeInMinutes / 40);
            if (isNaN(academicHours)) {
                console.error(`Invalid academic hours calculation for presenter: ${presenter.name}`);
                continue;
            }

            await AttendanceService.addAttendance({
                attendanceData: {
                    student: student._id,
                    session: matchingSession._id,
                    time_minute: timeInMinutes,
                    academic_hours: academicHours,
                },
            });
        }
    }

}

module.exports = AttendanceService;