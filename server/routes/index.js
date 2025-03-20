const express = require('express');
const login = require('./login');
const protected = require('./protected');
const students = require('./students');
const groups = require('./groups');
const sessions = require('./sessions');
const router = express.Router();

router
    .use('/auth', login)
    .use('/auth', protected)
    .use('/students', students)
    .use('/groups', groups)
    .use('/sessions', sessions);

module.exports = router;