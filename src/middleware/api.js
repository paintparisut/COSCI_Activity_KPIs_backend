const express = require("express");
const router = express.Router();
require("../db");



router.use('/admin',require('../routes/admin'));
router.use('/student',require('../routes/student'));
router.use('/teacher',require('../routes/teacher'));
router.use('/auth',require('../routes/auth'));
router.use('/file',require('../routes/file'));




module.exports = router;
