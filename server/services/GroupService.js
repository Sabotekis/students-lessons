const Group = require('../models/group.model');
const Student = require('../models/student.model');
const Session = require('../models/session.model');

class GroupService {
  static async getAllGroups({ includeDeleted = false } = {}) {
    const filter = includeDeleted ? {} : { deleted: false };
    return await Group.find(filter).populate('students');
}

static async getGroupById({ id, includeDeleted = false }) {
    const filter = includeDeleted ? { _id: id } : { _id: id, deleted: false };
    return await Group.findOne(filter).populate('students');
}

  static async createGroup({groupData}) {
    if (!groupData.academic_hours || groupData.academic_hours <= 0) {
      throw new Error('Academic hours must be a positive number');
    }
    const newGroup = new Group(groupData);
    return await newGroup.save();
  }

  static async updateGroup({id, groupData}) {
    if (groupData.academic_hours && groupData.academic_hours <= 0) {
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
}

module.exports = GroupService;