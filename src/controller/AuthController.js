const StudentRegister = require('../models/student_registered_schema');
const TeacherRegister = require('../models/teacher_registered_schema');
const StudentUploaded = require('../models/student_uploaded_schema');
const TeacherUploaded = require('../models/teacher_uploaded_schema');
const bcrypt = require('bcryptjs');
const jwt = require('../jwt');

const {registerStudentValidation,registerTeacherValidation,loginValidation,fetchUserUploadedValidation} = require('../services/validation');

const gswu_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@g.swu.ac.th$/

exports.registerStudent = async (req,res) => {

    const { error } = registerStudentValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    if (!gswu_regex.test(req.body.email)) return res.status(200).json({result: 'nOK', message: 'Please use g.swu.ac.th email domain', data: {}});

    const usernameExist = await StudentRegister.findOne({user_id: req.body.user_id});
    if (usernameExist) return res.status(200).json({result: 'nOK', message: 'Username already exists', data: {}});

    const idExist = await StudentRegister.findOne({user_id: req.body.student_id});
    if (idExist) return res.status(200).json({result: 'nOK', message: 'Student already exists', data: {}});

    const emailExist = await StudentRegister.findOne({email: req.body.email});
    if (emailExist) return res.status(200).json({result: 'nOK', message: 'Email already exists', data: {}});

    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        req.body.img_user = 'userimagedefault.png'

        const data = await StudentRegister.create(req.body);
        
        const userSchema = {
            user_id: data.user_id,
            name: data.name,
            student_id: data.student_id,
            teacher: data.teacher,
            major: data.teacher,
            email: data.email,
            tel: data.tel,
        }

        //otp


        res.status(200).json({result: 'OK', message: 'create user success', data: userSchema});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};

exports.registerTeacher = async (req,res) => {

    const { error } = registerTeacherValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    if (!gswu_regex.test(req.body.email)) return res.status(200).json({result: 'nOK', message: 'Please use g.swu.ac.th email domain', data: {}});

    const usernameExist = await TeacherRegister.findOne({user_id: req.body.user_id});
    if (usernameExist) return res.status(200).json({result: 'nOK', message: 'Username already exists', data: {}});

    const emailExist = await TeacherRegister.findOne({email: req.body.email});
    if (emailExist) return res.status(200).json({result: 'nOK', message: 'Email already exists', data: {}});

    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        req.body.img_user = 'userimagedefault.png'

        const data = await TeacherRegister.create(req.body);
        
        const userSchema = {
            user_id : data.user_id,
            name : data.name,
            password : data.password,
            role : data.role,
            email : data.dataemail,
            tel : data.tel
        }
        //otp

        res.status(200).json({result: 'OK', message: 'create user success', data: userSchema});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};

exports.loginStudent = async (req,res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {
        
        const user_id = req.body.user_id
        const password = req.body.password

        const data = await StudentRegister.findOne({ user_id: user_id} );

        if (data) {
            const isPasswordValid = await bcrypt.compare(password, data.password);
            if (isPasswordValid) {

                const userSchema = {
                    user_id: data.user_id,
                    name: data.name,
                    student_id: data.student_id,
                    teacher: data.teacher,
                    major: data.teacher,
                    email: data.email,
                    tel: data.tel,
                    img_user: data.img_user
                }
  
                const token = jwt.sign(userSchema);
                console.log(token)

                res.status(200).header('Authorization', `Bearer ${token}`).json({ result: 'OK', message: 'success sign in', data: userSchema });
            } else {
                res.status(200).json({ result: 'nOK', message: 'invalid username or password', data: {}});
            }
        } else {
            res.status(200).json({ result: 'nOK', message: 'invalid username or password', data: {}});
        }
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};

exports.getStudentUploaded = async(req,res) => { 
    const user_id = req.body.user_id

    const { error } = fetchUserUploadedValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

try {

    const data = await StudentUploaded.findOne({ 
        user_id: user_id
    } )

    if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

    if (data.register_check == true) return res.status(200).json({result: 'nOK', message: 'เป็นสมาชิกอยู่แล้ว', data: {}});
    
    const userSchema = {
        user_id : data.user_id,
        name : data.name,
        major : data.major,
        teacher : data.major,
        register_check: data.register_check
    }

    res.status(200).json({result: 'OK', message: 'success user data', data: {data: userSchema}});
} catch (e) {
    res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
}
}


exports.getTeacherUploaded = async(req,res) => { 
    const user_id = req.body.user_id

    const { error } = fetchUserUploadedValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

try {

    const data = await TeacherUploaded.findOne({ 
        user_id: user_id
    } )

    if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

    if (data.register_check == true) return res.status(403).json({result: 'nOK', message: 'เป็นสมาชิกอยู่แล้ว', data: {}});
    
    const userSchema = {
        user_id : data.user_id,
        name : data.name,
        role : data.role,
        email : data.email,
        tel : data.tel,
        register_check: data.register_check
        
    }
    
    res.status(200).json({result: 'OK', message: 'success user data', data: {data: userSchema}});
} catch (e) {
    res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
}
}

exports.studentcheck = async (req,res) => {

    const userid = req.body.student_id

    const { error } = registerStudentValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {

        const data = await StudentUploaded.findOne({ 
            user_id: userid
        } )

        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        if(data.register_check === true) return res.status(403).json({result: 'nOK', message: 'เป็นสมาชิกอยู่แล้ว', data: {}});
  
        data.register_check = true

        const newData = await StudentUploaded.findOneAndUpdate({ user_id: userid}, data)

        const schema = {
            user_id : newData.user_id,
            name : newData.name,
            major : newData.major,
            teacher : newData.teacher,
            register_check: data.register_check
        }

        res.status(200).json({result: 'OK', message: 'success checked student', data: schema});
        
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.teachercheck = async (req,res) => {

    const userid = req.body.user_id

    const { error } = registerTeacherValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {

        const data = await TeacherUploaded.findOne({ 
            user_id: userid
        } )

        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        if(data.register_check === true) return res.status(403).json({result: 'nOK', message: 'เป็นสมาชิกอยู่แล้ว', data: {}});
  
        data.register_check = true

        const newData = await TeacherUploaded.findOneAndUpdate({user_id: userid}, data)

        const schema = {
            user_id : newData.user_id,
            name : newData.name,
            role : newData.role,
            email : newData.email,
            tel : newData.tel,
            register_check: true
        }

        res.status(200).json({result: 'OK', message: 'success checked student', data: schema});
        
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}