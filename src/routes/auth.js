const express = require('express');
const router = express.Router();
const jwt = require('../jwt');

const AuthController = require('../controller/AuthController');


router.post('/student_register',AuthController.registerStudent)


module.exports = router;