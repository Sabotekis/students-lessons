const Student = require('../models/student.model');

class StudentService {
  static async getAllStudents({ includeDeleted = false } = {}) {
    const filter = includeDeleted ? {} : { deleted: false };
    return await Student.find(filter).populate('groups').select('name surname personal_code total_academic_hours');
  }

  static async getStudentById({ id, includeDeleted = false }) {
    const filter = includeDeleted ? { _id: id } : { _id: id, deleted: false };
    return await Student.findOne(filter).populate('groups').select('name surname personal_code total_academic_hours groupAcademicHours');
  }
  
  static async createStudent({studentData}) {
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

  static async updateStudent({id, studentData}) {
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

  static async deleteStudent({ id }) {
    const student = await Student.findById(id);
    if (!student) {
        throw new Error('Student not found');
    }

    student.deleted = true;
    await student.save();

    return student;
}
}

module.exports = StudentService;