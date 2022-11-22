const express = require('express');
const router = express.Router();
const jwt = require('../jwt');
const TeacherController = require('../controller/TeacherController');

router.get('/request-history',TeacherController.reqHistory)
router.get('/kpi-active',TeacherController.getkpiactive)


module.exports = router;