const Group = require('../models/group.model');
const Student = require('../models/student.model');

class GroupService {
  static async getAllGroups() {
    return await Group.find().populate('students');
  }

  static async getGroupById(id) {
    return await Group.findById(id).populate('students');
  }

  static async createGroup(groupData) {
    const newGroup = new Group(groupData);
    return await newGroup.save();
  }

  static async updateGroup(id, groupData) {
    return await Group.findByIdAndUpdate(id, groupData, { new: true }).populate('students');
  }

  static async deleteGroup(id) {
    return await Group.findByIdAndDelete(id);
  }

  static async addStudentToGroup(groupId, studentId) {
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

  static async removeStudentFromGroup(groupId, studentId) {
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