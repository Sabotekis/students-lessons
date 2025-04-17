const express = require('express');
const router = express.Router();
const CertificateService = require('../services/CertificateService');

router.get('/', async (req, res) => {
    try {
        const certificates = await CertificateService.getAllCertificates();
        res.json(certificates);
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { student, group } = req.body;
        const certificate = await CertificateService.createCertificate({ student, group });
        res.status(201).json(certificate);
    } catch (error) {
        console.error('Error creating certificate:', error);
        res.status(500).json({ error: error.message });
    }
}); 

router.get('/eligible-students/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;
        const eligibleStudents = await CertificateService.getEligibleStudentsForCertificate({ groupId });
        res.status(200).json(eligibleStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:certificateId/download-pdf', async (req, res) => {
    try {
        const { certificateId } = req.params;
        const pdfBuffer = await CertificateService.generatePDF({certificateId});
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificate_${certificateId}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Failed to generate PDF');
    }
});

router.get('/register', async (req, res) => {
    try {
        const certificates = await CertificateService.getCertificateRegister();
        res.json(certificates);
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;