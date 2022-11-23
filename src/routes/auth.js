const express = require('express');
const router = express.Router();
const jwt = require('../jwt');

const AuthController = require('../controller/AuthController');


router.post('/student_register',AuthController.registerStudent)
router.post('/teacher_register',AuthController.registerTeacher)
router.post('/login_student', AuthController.loginStudent);
router.post('/login_student', AuthController.loginStudent);

router.get('/getstudent_uploaded', AuthController.getStudentUploaded);
router.get('/getteacher_uploaded', AuthController.getTeacherUploaded);




module.exports = router;