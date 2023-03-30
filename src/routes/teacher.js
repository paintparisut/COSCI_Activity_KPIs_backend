const express = require('express');
const router = express.Router();
const jwt = require('../jwt');
const TeacherController = require('../controller/TeacherController');

router.post('/request-history',jwt.verify,TeacherController.reqHistory)
router.get('/kpi-active',jwt.verify,TeacherController.getkpiactive)
router.patch('/changepassword',jwt.verify,TeacherController.changepassword)
router.post('/request',jwt.verify,TeacherController.createRequest)
router.get('/event/:id',jwt.verify,TeacherController.getsinglekpi)

module.exports = router;