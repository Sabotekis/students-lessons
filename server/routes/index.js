const express = require('express');
const login = require('./login');
const protected = require('./protected');
const students = require('./students');
const groups = require('./groups');
const sessions = require('./sessions');
const attendance = require('./attendance');
const certificates = require('./certificates');
const router = express.Router();

router
    .use('/auth', login)
    .use('/auth', protected)
    .use('/students', protected, students)
    .use('/groups', protected, groups)
    .use('/sessions', protected, sessions)
    .use('/attendance', protected, attendance)
    .use('/certificates', protected, certificates);

module.exports = router;