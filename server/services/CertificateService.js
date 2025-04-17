const Certificate = require('../models/certificate.model');
const Group = require('../models/group.model');
const PDFDocument = require('pdfkit');
const path = require('path');
const GroupService = require('./GroupService');
const Student = require('../models/student.model'); 
const Attendance = require('../models/attendance.model');

class CertificateService {
    static async createCertificate({ student, group }) {
        const selectedGroup = await Group.findById(group);
        if (!selectedGroup) {
            throw new Error('Group not found');
        }
    
        const studentData = await Student.findById(student);
        if (!studentData) {
            throw new Error('Student not found');
        }
    
        const issueData = selectedGroup.endDate;
    
        selectedGroup.certificateCounter += 1;
    
        const certificateNumber = selectedGroup.certificateCounter.toString(); 
    
        await selectedGroup.save();
    
        const certificate = new Certificate({ student, group, issueData, certificateNumber });
        await certificate.save();
    
        selectedGroup.certificates.push(certificate._id);
        await selectedGroup.save();
    
        studentData.certificates.push(certificate._id);
        await studentData.save();
    
        return certificate;
    }

    static async getAllCertificates() {
        return await Certificate.find().populate('student group');
    }

    static async getEligibleStudentsForCertificate({ groupId }) {
        const group = await Group.findById(groupId).populate('students').populate('sessions');
        if (!group) {
            throw new Error('Group not found');
        }
    
        const attendances = await Attendance.find({
            session: { $in: group.sessions.map(session => session._id) },
        }).populate('student');
    
        const certificates = await Certificate.find({ group: groupId });
    
        const eligibleStudents = group.students.filter(student => {
            const studentAttendances = attendances.filter(a => a.student._id.equals(student._id));
            const totalHours = studentAttendances.reduce((sum, attendance) => sum + attendance.academicHours, 0);
    
            const hasCertificate = certificates.some(cert => cert.student.equals(student._id));
    
            return totalHours >= group.minHours && !hasCertificate;
        });
    
        return eligibleStudents.map(student => ({
            id: student._id,
            name: student.name,
            surname: student.surname,
            totalHours: attendances
                .filter(a => a.student._id.equals(student._id))
                .reduce((sum, attendance) => sum + attendance.academicHours, 0),
        }));
    }

    static async generatePDF({certificateId}) {
        const certificate = await Certificate.findById(certificateId).populate('student group');
        if (!certificate) {
            throw new Error('Certificate not found');
        }

        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});

        const fontPath = path.join(__dirname, '../assets/fonts/DejaVuSans.ttf');
        const fontPathBold = path.join(__dirname, '../assets/fonts/DejaVuSans-Bold.ttf');
        doc.registerFont('DejaVuSans', fontPath);
        doc.registerFont('DejaVuSans-Bold', fontPathBold);

        doc.fontSize(20).font("DejaVuSans-Bold").text('APLIECĪBA', { align: 'center' });
        doc.moveDown();
        doc.fontSize(18).font("DejaVuSans-Bold").text('par izglītības programmas apguvi', { align: 'center'});
        doc.moveDown();
        doc.fontSize(11).font("DejaVuSans").text(`${certificate.student.name} ${certificate.student.surname}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).font("DejaVuSans-Bold").text('ir apguvis neformālās izglītības programmu', { align: 'center' });
        doc.moveDown();
        doc.fontSize(11).font("DejaVuSans").text(`${certificate.group.title}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(11).font("DejaVuSans").text(`Programmas stundu skaits: ${certificate.group.academicHours}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(11).font("DejaVuSans").text(`Apguves periods: ${new Date(certificate.group.startDate).toLocaleDateString("lv-LV")} - ${new Date(certificate.group.endDate).toLocaleDateString("lv-LV")}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(11).font("DejaVuSans")
            .text(`Datums: ${new Date(certificate.issueData).toLocaleDateString("lv-LV")}`, { align: 'left', continued: true })
            .text(`Reģistrācijas Nr. ${certificate.certificateNumber}`, { align: 'right' });
        doc.end();  

        return new Promise((resolve, reject) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
            doc.on('error', (err) => {
                reject(err);
            });
        });
    }

    static async getCertificateRegister() {
        const certificates = await Certificate.find().populate('student group');
        return certificates.map(certificate => ({
            certificateType: "NI",
            certificateNumber: certificate.certificateNumber,
            studentName: `${certificate.student.name} ${certificate.student.surname}`,
            personalCode: certificate.student.personalCode,
            group: certificate.group.title,           
            period: `${new Date(certificate.group.startDate).toLocaleDateString('lv-LV')} - ${new Date(certificate.group.endDate).toLocaleDateString('lv-LV')}`,
            registerNumber: certificate.group.registerNumber,
            issueDate: new Date(certificate.issueData).toLocaleDateString('lv-LV'),
        }));
    }
}

module.exports = CertificateService;