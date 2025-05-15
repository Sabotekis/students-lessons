const Session = require('../models/session.model');
const Student = require('../models/student.model');
const Group = require('../models/group.model');

class SessionService {
    static async getAllSessions() {
        return await Session.find({ deleted: false, finished: false })
            .populate({
                path: 'group',
                select: 'title startDate endDate professor'
            })
            .select('startDateTime endDateTime group finished');
    }

    static async getFinishedSessions() {
        return await Session.find({ finished: true, deleted: false })
            .populate({
                path: 'group',
                select: 'title startDate endDate professor'
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

    static async getSessionById({ id }) {
        return await Session.findById(id)
            .populate('group')
            .populate('students')
            .populate({
                path: 'attendances',
                populate: {
                    path: 'student', 
                    select: '_id name surname personalCode'
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
        const { students } = sessionData;
    
        const existingSession = await Session.findById(id).populate('students');
        if (!existingSession) {
            throw new Error('Session not found');
        }
    
        const oldStudentIds = existingSession.students.map(student => student._id.toString());
        await Student.updateMany(
            { _id: { $in: oldStudentIds } },
            { $pull: { sessions: id } }
        );
    
        const updatedSession = await Session.findByIdAndUpdate(id, sessionData, { new: true }).populate('students');
    
        await Student.updateMany(
            { _id: { $in: students } },
            { $addToSet: { sessions: id } }
        );
    
        return updatedSession;
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
}

module.exports = SessionService;