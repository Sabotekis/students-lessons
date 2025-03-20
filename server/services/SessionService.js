const Session = require('../models/session.model');

class SessionService {
    static async getAllSessions() {
        return await Session.find().populate('group').populate('students');
    }

    static async getSessionById(id) {
        return await Session.findById(id).populate('group').populate('students');
    }

    static async createSession(sessionData) {
        const newSession = new Session(sessionData);
        return await newSession.save();
    }

    
  static async updateSession(id, sessionData) {
        return await Session.findByIdAndUpdate(id, sessionData, { new: true });
    }

    static async deleteSession(id) {
        return await Session.findByIdAndDelete(id);
    }
}

module.exports = SessionService;