const Session = require('../models/session.model');
const Student = require('../models/student.model');
const Group = require('../models/group.model');

class SessionService {
    static async getAllSessions() {
        return await Session.find({ deleted: false, finished: false })
            .populate({
                path: 'group',
                select: 'title start_date end_date professor'
            })
            .select('date group finished');
    }

    static async getFinishedSessions() {
        return await Session.find({ finished: true, deleted: false })
            .populate({
                path: 'group',
                select: 'title start_date end_date professor'
            })
            .populate('students')
            .populate({
                path: 'attendances',
                populate: {
                    path: 'student',
                    select: '_id'
                }
            }); 
    }

    static async getDeletedSessions() {
        return await Session.find({ deleted: true })
            .populate({
                path: 'group',
                select: 'title start_date end_date professor'
            })
            .populate('students');
    }
    static async getSessionById({ id }) {
        return await Session.findById(id)
            .populate('group')
            .populate('students')
            .populate({
                path: 'attendances',
                populate: {
                    path: 'student', 
                    select: '_id name surname personal_code'
                }
            });
    }

    static async createSession({ sessionData }) {
        const { group, students } = sessionData;
        const newSession = new Session(sessionData);
        const savedSession = await newSession.save();

        await Group.findByIdAndUpdate(
            group,
            { $push: { sessions: savedSession._id } },
            { new: true }
        );

        await Student.updateMany(
            { _id: { $in: students } },
            { $push: { sessions: savedSession._id } }
        );

        return savedSession;
    }

    static async updateSession({ id, sessionData }) {
        return await Session.findByIdAndUpdate(id, sessionData, { new: true });
    }

    static async deleteSession({ id }) {
        const session = await Session.findByIdAndUpdate(
            id,
            { deleted: true },
            { new: true }
        );

        if (session && session.group) {
            await Group.findByIdAndUpdate(
                session.group,
                { $pull: { sessions: session._id } },
                { new: true }
            );
        }

        return session;
    }

    static async addStudentToSession({ sessionId, studentId }) {
        const student = await Student.findById(studentId);
        if (!student || student.deleted) {
            throw new Error('Cannot add a deleted student to a session');
        }
    
        const session = await Session.findById(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
    
        if (!session.students.includes(studentId)) {
            session.students.push(studentId);
            await session.save();
        }
    
        return session;
    }

    static async removeStudentFromSession({ sessionId, studentId }) {
        const student = await Student.findById(studentId);
        if (!student || student.deleted) {
            throw new Error('Cannot remove a deleted student from a session');
        }
    
        const session = await Session.findById(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
    
        session.students = session.students.filter(id => id.toString() !== studentId);
        await session.save();
    
        return session;
    }
}

module.exports = SessionService;