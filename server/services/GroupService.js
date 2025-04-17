const Group = require('../models/group.model');
const Student = require('../models/student.model');
const Session = require('../models/session.model');
const Attendance = require('../models/attendance.model');
const Certificate = require('../models/certificate.model');

class GroupService {
  static async getAllGroups({ includeDeleted = false } = {}) {
    const filter = includeDeleted ? {} : { deleted: false };
    return await Group.find(filter).populate('students');
  }

  static async getGroupById({ id, includeDeleted = false }) {
    const filter = includeDeleted ? { _id: id } : { _id: id, deleted: false };
    return await Group.findOne(filter).populate('students');
  }

  static async createGroup({ groupData }) {
    if (!groupData.academicHours || groupData.academicHours <= 0) {
        throw new Error('Academic hours must be a positive number');
    }

    const randomCertificateCounter = Math.floor(10000 + Math.random() * 90000); 

    const newGroup = new Group({
        ...groupData,
        plannedData: groupData.plannedData, 
        certificateCounter: randomCertificateCounter,
    });

    return await newGroup.save();
  }

  static async updateGroup({id, groupData}) {
    if (groupData.academicHours && groupData.academicHours <= 0) {
      throw new Error('Academic hours must be a positive number');
    }
    return await Group.findByIdAndUpdate(id, groupData, { new: true }).populate('students');
  }
  
  static async deleteGroup({ id }) {
    const group = await Group.findById(id);
    if (!group) {
        throw new Error('Group not found');
    }

    group.deleted = true;
    await group.save();

    await Session.updateMany(
        { group: id },
        { deleted: true }
    );

    return group;
}

  static async addStudentToGroup({groupId, studentId}) {
    const group = await Group.findById(groupId);
    const student = await Student.findById(studentId);

    if (!group || !student) {
      throw new Error('Group or Student not found');
    }

    if (!group.students.includes(studentId)) {
      group.students.push(studentId);
      student.groups.push(groupId);
      await group.save();
      await student.save();
    }

    return group;
  }

  static async removeStudentFromGroup({groupId, studentId}) {
    const group = await Group.findById(groupId);
    const student = await Student.findById(studentId);

    if (!group || !student) {
      throw new Error('Group or Student not found');
    }

    group.students = group.students.filter(id => id.toString() !== studentId);
    student.groups = student.groups.filter(id => id.toString() !== groupId);

    await group.save();
    await student.save();

    return group;
  }

  static async generateGroupReport({ groupId }) {
    const group = await Group.findById(groupId).populate('students').populate('sessions');
    if (!group) {
        throw new Error("Group not found");
    }

    const attendances = await Attendance.find({
        session: { $in: group.sessions.map(session => session._id) },
    }).populate('student').populate('session');

    const certificates = await Certificate.find({ group: groupId }).populate('student');

    return group.students.map(student => {
      const studentAttendances = attendances.filter(a => a.student._id.equals(student._id));
      const totalHours = studentAttendances.reduce((sum, attendance) => sum + attendance.academicHours, 0);
      const studentCertificate = certificates.find(cert => cert.student._id.equals(student._id));

      return {
        name: `${student.name} ${student.surname}`,
        totalHours,
        status: studentCertificate ? "Ieskaitīts" : "Neieskaitīts",
        certificateType: studentCertificate ? "NI" : "Nav",
        certificateNumber: studentCertificate ? studentCertificate.certificateNumber : "Nav",
        period: `${new Date(group.startDate).toLocaleDateString('lv-LV')} - ${new Date(group.endDate).toLocaleDateString('lv-LV')}`,
        issueDate: studentCertificate ? `${new Date(group.endDate).toLocaleDateString('lv-LV')}` : "Nav",
      };
    });
  }
  
  static async generateGroupRegister({ groupId }) {
    const group = await Group.findById(groupId).populate('students').populate('sessions');
    if (!group) {
        throw new Error("Group not found");
    }
    const certificates = await Certificate.find({ group: groupId }).populate('student');

    return group.students.map(student => {
        const studentCertificate = certificates.find(cert => cert.student._id.equals(student._id));

        return {
            name: `${student.name} ${student.surname}`,
            personalCode: student.personalCode,
            status: studentCertificate ? "Ieskaitīts" : "Neieskaitīts",
            certificateType: studentCertificate ? "NI" : "Nav",
            certificateNumber: studentCertificate ? studentCertificate.certificateNumber : "Nav",
            issueDate: studentCertificate ? `${new Date(group.endDate).toLocaleDateString('lv-LV')}` : "Nav",
        };
    });
}
}

module.exports = GroupService;