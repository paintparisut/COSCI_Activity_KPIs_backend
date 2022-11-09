const StudentRegister = require('../models/student_registered_schema');
const TeacherRegister = require('../models/teacher_registered_schema');
const StudentUploaded = require('../models/student_uploaded_schema');
const TeacherUploaded = require('../models/teacher_uploaded_schema');

const {registerStudentValidation,registerTeacherValidation} = require('../services/validation');