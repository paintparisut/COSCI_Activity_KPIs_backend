const express = require('express');
const router = express.Router();
const jwt = require('../jwt');


const AdminController = require('../controller/AdminController');

// router.post('/admin-add-activity',jwt.verify,AdminController.uploadevent)
router.post('/add-activity',AdminController.uploadevent)

router.get('/kpi-dashboard',AdminController.getkpi)
router.get('/activity-dashboard',AdminController.getactivity)
router.get('/reqteacher-dashboard',AdminController.getrequestteacher)
router.get('/reqstudent-dashboard',AdminController.getrequeststudent)
router.get('/kpi-active-dashboard',AdminController.getkpiactive)
router.get('/activity-active-dashboard',AdminController.getactivityactive)

module.exports = router;