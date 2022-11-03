const express = require('express');
const router = express.Router();
const jwt = require('../jwt');


const AdminController = require('../controller/AdminController');

router.post('/admin-add-activity',jwt.verify,AdminController.uploadevent)

router.get('/admin-activity-dashboard',AdminController.getkpi)

module.exports = router;