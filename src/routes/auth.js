const express = require('express');
const router = express.Router();

const AuthController = require('../controller/AuthController');


router.post('/student-register',AuthController.registerStudent)
router.post('/teacher-register',AuthController.registerTeacher)
router.post('/login-student', AuthController.loginStudent);
router.post('/login-student', AuthController.loginStudent);

router.get('/getstudent-uploaded', AuthController.getStudentUploaded);
router.get('/getteacher-uploaded', AuthController.getTeacherUploaded);
router.patch('/student-check', AuthController.studentcheck);
router.patch('/teacher-check', AuthController.teachercheck);




module.exports = router;