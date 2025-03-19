const Student = require('../models/student.model');

class StudentService {
  static async getAllStudents() {
    return await Student.find().populate('groups');
  }

  static async getStudentById(id) {
    return await Student.findById(id).populate('groups');
  }

  static async createStudent(studentData) {
    const personalCodeRegex = /^\d{6}-?\d{5}$/;
    if (!personalCodeRegex.test(studentData.personal_code)) {
      throw new Error("Personal code must be in the proper format");
    }
    studentData.personal_code = studentData.personal_code.replace('-', '');
    if (studentData.personal_code.length !== 11) {
      throw new Error("Personal code must be exactly 11 digits");
    }
    const newStudent = new Student(studentData);
    return await newStudent.save();
  }

  static async updateStudent(id, studentData) {
    const personalCodeRegex = /^\d{6}-?\d{5}$/;
    if (!personalCodeRegex.test(studentData.personal_code)) {
      throw new Error("Personal code must be in the proper format");
    }
    studentData.personal_code = studentData.personal_code.replace('-', '');
    if (studentData.personal_code.length !== 11) {
      throw new Error("Personal code must be exactly 11 digits");
    }
    return await Student.findByIdAndUpdate(id, studentData, { new: true });
  }

  static async deleteStudent(id) {
    return await Student.findByIdAndDelete(id);
  }
}

module.exports = StudentService;