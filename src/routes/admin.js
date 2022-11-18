const express = require('express');
const router = express.Router();
const jwt = require('../jwt');


const AdminController = require('../controller/AdminController');

// router.post('/admin-add-activity',jwt.verify,AdminController.uploadevent)
router.post('/admin-add-activity',AdminController.uploadevent)

router.get('/admin-kpi-dashboard',AdminController.getkpi)
router.get('/admin-activity-dashboard',AdminController.getactivity)
router.get('/admin-reqteacher-dashboard',AdminController.getrequestteacher)
router.get('/admin-reqstudent-dashboard',AdminController.getrequeststudent)
router.get('/admin-kpi-active-dashboard',AdminController.getkpiactive)
router.get('/admin-activity-active-dashboard',AdminController.getactivityactive)

module.exports = router;