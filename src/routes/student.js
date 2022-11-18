const express = require('express');
const router = express.Router();
const jwt = require('../jwt');
const StudentController = require('../controller/StudentController');


router.get('/student-request-history',StudentController.getreqHistory)

module.exports = router;