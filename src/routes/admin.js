const express = require('express');
const router = express.Router();
const jwt = require('../jwt');
const AdminController = require('../controller/AdminController');

router.patch('/edit-event',jwt.verify,AdminController.editevent)
router.patch('/update-req',jwt.verify,AdminController.updateReq)

//activity
router.post('/add-activity',jwt.verify,AdminController.uploadevent)
router.get('/activity-dashboard',jwt.verify,AdminController.getactivity)

//kpi
router.get('/kpi-dashboard',jwt.verify,AdminController.getkpi)
router.get('/kpi-active-dashboard',jwt.verify,AdminController.getkpiactive)

//student req
router.get('/reqstudent-dashboard',jwt.verify,AdminController.getrequeststudent)

//teacher req
router.get('/reqteacher-dashboard',jwt.verify,AdminController.getrequestteacher)

//home zone
router.get('/kpi-active-dashboard',jwt.verify,AdminController.getkpiactive)
router.get('/activity-active-dashboard',jwt.verify,AdminController.getactivityactive)

//crud
router.get('/crud-student',jwt.verify,AdminController.studentCRUD)
router.get('/crud-teacher',jwt.verify,AdminController.teacherCRUD)


module.exports = router;