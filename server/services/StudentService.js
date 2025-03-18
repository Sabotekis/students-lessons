const Student = require('../models/student.model');

class StudentService {
  static async getAllStudents() {
    return await Student.find().populate('groups');
  }

  static async getStudentById(id) {
    return await Student.findById(id).populate('groups');
  }

  static async createStudent(studentData) {
    const newStudent = new Student(studentData);
    return await newStudent.save();
  }

  static async updateStudent(id, studentData) {
    return await Student.findByIdAndUpdate(id, studentData, { new: true });
  }

  static async deleteStudent(id) {
    return await Student.findByIdAndDelete(id);
  }
}

module.exports = StudentService;