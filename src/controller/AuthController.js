const StudentRegister = require('../models/student_registered_schema');
const TeacherRegister = require('../models/teacher_registered_schema');
const StudentUploaded = require('../models/student_uploaded_schema');
const TeacherUploaded = require('../models/teacher_uploaded_schema');

const {registerStudentValidation,registerTeacherValidation,loginValidation} = require('../services/validation');

const gswu_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@g.swu.ac.th$/

exports.registerStudent = async (req,res) => {

    const { error } = registerStudentValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    if (!gswu_regex.test(req.body.email)) return res.status(200).json({result: 'nOK', message: 'Please use g.swu.ac.th email domain', data: {}});

    const usernameExist = await StudentRegister.findOne({username: req.body.user_id});
    if (usernameExist) return res.status(200).json({result: 'nOK', message: 'Username already exists', data: {}});

    const emailExist = await StudentRegister.findOne({email: req.body.email});
    if (emailExist) return res.status(200).json({result: 'nOK', message: 'Email already exists', data: {}});

    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);

        req.body.profile_pic = 'userimagedefault.png'

        const data = await StudentRegister.create(req.body);
        
        const userSchema = {
            user_id: data.user_id,
            name: data.name,
            student_id: data.student_id,
            teacher: data.teacher,
            major: data.teacher,
            email: data.email,
            tel: data.tel,
            teacher: data.teacher,
        }

        //otp


        res.status(200).json({result: 'OK', message: 'success create account please verify account by email in 15 minutes', data: userSchema});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};