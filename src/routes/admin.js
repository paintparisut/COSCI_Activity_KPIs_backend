const express = require('express');
const router = express.Router();
const jwt = require('../jwt');


const AdminController = require('../controller/AdminController');

// router.post('/admin-add-activity',jwt.verify,AdminController.uploadevent)
router.post('/add-activity',jwt.verify,AdminController.uploadevent)

router.get('/kpi-dashboard',jwt.verify,AdminController.getkpi)
router.get('/activity-dashboard',jwt.verify,AdminController.getactivity)
router.get('/reqteacher-dashboard',jwt.verify,AdminController.getrequestteacher)
router.get('/reqstudent-dashboard',jwt.verify,AdminController.getrequeststudent)
router.get('/kpi-active-dashboard',jwt.verify,AdminController.getkpiactive)
router.get('/activity-active-dashboard',jwt.verify,AdminController.getactivityactive)

module.exports = router;