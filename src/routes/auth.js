const express = require('express');
const router = express.Router();

const AuthController = require('../controller/AuthController');


router.post('/student-register',AuthController.registerStudent)
router.post('/teacher-register',AuthController.registerTeacher)
router.post('/login-student', AuthController.loginStudent);
router.post('/login-teacher', AuthController.loginTeacher);
router.post('/verifystudent', AuthController.verifystudent);
router.post('/verifyteacher', AuthController.verifyteacher);
router.post('/verify/resendstudent', AuthController.verifyResendCodeStudent);
router.post('/verify/resendteacher', AuthController.verifyResendCodeTeacher);


router.get('/getstudent-uploaded', AuthController.getStudentUploaded);
router.get('/getteacher-uploaded', AuthController.getTeacherUploaded);
router.patch('/student-check', AuthController.studentcheck);
router.patch('/teacher-check', AuthController.teachercheck);
router.patch('/forgotpassword-student', AuthController.forgotpasswordstudent);
router.patch('/forgotpassword-teacher', AuthController.forgotpasswordteacher);






module.exports = router;