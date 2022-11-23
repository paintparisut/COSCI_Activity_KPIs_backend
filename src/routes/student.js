const express = require('express');
const router = express.Router();
const jwt = require('../jwt');
const StudentController = require('../controller/StudentController');


router.get('/request-history',jwt.verify,StudentController.reqHistory)
router.get('/activity-active',jwt.verify,StudentController.getactivityactive)


module.exports = router;