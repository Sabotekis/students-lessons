const express = require('express');
const login = require('./login');
const protected = require('./protected');
const students = require('./students');
const groups = require('./groups');
const router = express.Router();

router
    .use('/auth', login)
    .use('/auth', protected)
    .use('/students', students)
    .use('/groups', groups);

module.exports = router;