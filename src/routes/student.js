const express = require('express');
const router = express.Router();
const jwt = require('../jwt');
const StudentController = require('../controller/StudentController');


router.get('/request-history',jwt.verify,StudentController.reqHistory)
router.get('/activity-active',jwt.verify,StudentController.getactivityactive)
router.post('/request',jwt.verify,StudentController.createRequest)
router.patch('/changepassword',jwt.verify,StudentController.changepassword)


module.exports = router;