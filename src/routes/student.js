const express = require('express');
const router = express.Router();
const jwt = require('../jwt');
const StudentController = require('../controller/StudentController');


router.get('/request-history',StudentController.reqHistory)
router.get('/activity-active',StudentController.getactivityactive)


module.exports = router;