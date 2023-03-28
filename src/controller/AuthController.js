const StudentRegister = require('../models/student_registered_schema');
const TeacherRegister = require('../models/teacher_registered_schema');
const StudentUploaded = require('../models/student_uploaded_schema');
const TeacherUploaded = require('../models/teacher_uploaded_schema');
const Otps = require('../models/opt_schema');
const bcrypt = require('bcryptjs');
const jwt = require('../jwt');
const moment = require('moment');
const {registerStudentValidation} = require('../services/validation/registerStudentValidation');
const {registerTeacherValidation} = require('../services/validation/registerTeacherValidation');
const {loginValidation} = require('../services/validation/loginValidation');
const {fetchUserUploadedValidation} = require('../services/validation/fetchUserUploadedValidation');
const {forgotPasswordValidation} = require('../services/validation/forgotPasswordValidate');
const {verifyValidation} = require('../services/validation/verifyValidation');
const { generateOtpcode, mailer , generatePassword } = require('../services/utilities');

const gswu_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@g.swu.ac.th$/

exports.registerStudent = async (req,res,next) => {

    const { error } = registerStudentValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    if (!gswu_regex.test(req.body.email)) return res.status(200).json({result: 'nOK', message: 'Please use g.swu.ac.th email domain', data: {}});

    const usernameExist = await StudentRegister.findOne({user_id: req.body.user_id});
    if (usernameExist) return res.status(200).json({result: 'nOK', message: 'Username already exists', data: {}});

    const idExist = await StudentRegister.findOne({user_id: req.body.student_id});
    if (idExist) return res.status(200).json({result: 'nOK', message: 'Student already exists', data: {}});

    const emailExist = await StudentRegister.findOne({email: req.body.email});
    if (emailExist) return res.status(200).json({result: 'nOK', message: 'Email already exists', data: {}});

    const optExist = await Otps.findOne({email: req.body.email});
    if (optExist) return res.status(200).json({result: 'nOK', message: 'Check your otps', data: {}});

    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        req.body.img_user = 'userimagedefault.png'
        const text = req.body.student_id
        const result1 = text.substr(0, 3);
        const result2 = text.substr(5, 11);
        const result = "co" + result1 + result2
        req.body.user_id = result

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
        const minutesToAdd = 15;
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);

        const OTP_Schema = {
            email: data.email,
            otp: generateOtpcode(),
            expired: futureDate,
        }

        await Otps.create(OTP_Schema);

        mailer(data.email,'Verify your account',`คุณ, ${data.name} <br><br>username : ${data.user_id} <br><br>รหัสยืนยันการสมัครสมาชิก : ${OTP_Schema.otp}`)
        // res.status(200).json({result: 'OK', message: 'success create account please verify account by email in 15 minutes', data: userSchema});
        next();

    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};

exports.registerTeacher = async (req,res,next) => {

    const { error } = registerTeacherValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    if (!gswu_regex.test(req.body.email)) return res.status(200).json({result: 'nOK', message: 'Please use g.swu.ac.th email domain', data: {}});

    const userFlag = await TeacherUploaded.findOne({
        user_id: req.body.user_id,
        register_check : false
    });
    if (!userFlag) return res.status(200).json({result: 'nOK', message: 'flag', data: {}});

    const usernameExist = await TeacherRegister.findOne({user_id: req.body.user_id});
    if (usernameExist) return res.status(200).json({result: 'nOK', message: 'Username already exists', data: {}});

    const emailExist = await TeacherRegister.findOne({email: req.body.email});
    if (emailExist) return res.status(200).json({result: 'nOK', message: 'Email already exists', data: {}});

    const optExist = await Otps.findOne({email: req.body.email});
    if (optExist) return res.status(200).json({result: 'nOK', message: 'Check your otps', data: {}});

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
        const minutesToAdd = 15;
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);

        const OTP_Schema = {
            email: data.email,
            otp: generateOtpcode(),
            expired: futureDate,
        }

        await Otps.create(OTP_Schema);

        mailer(data.email,'Verify your account',`คุณ, ${data.name} <br><br>username : ${data.user_id} <br><br>รหัสยืนยันการสมัครสมาชิก : ${OTP_Schema.otp}`)
        // res.status(200).json({result: 'OK', message: 'success create account please verify account by email in 15 minutes', data: userSchema});
        next();
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};

exports.verifystudent = async (req,res) => {
    const { error } = verifyValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {
        const email = req.body.email
        const otp = req.body.otp

        const data = await Otps.findOne({email: email});
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const user_data = await StudentRegister.findOne({email: email});
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const userSchema = {
            _id: user_data._id,
            user_id: user_data.user_id,
            name: user_data.name,
            student_id: user_data.student_id,
            teacher: user_data.teacher,
            major: user_data.teacher,
            email: user_data.email,
            tel: user_data.tel,
            img_user: user_data.img_user
        }

        if(otp !== data.otp) return res.status(200).json({result: 'nOK', message: 'otp code not the same', data: {}});

        if(moment().isAfter(data.expired)) {
            const minutesToAdd = 15;
            const currentDate = new Date();
            const futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);

            const OTP_Schema = {
                email: user_data.email,
                otp: generateOtpcode(),
                expired: futureDate,
            }

            await Otps.findOneAndUpdate({email: user_data.email}, OTP_Schema);

            mailer(user_data.email,'Verify your account',`คุณ, ${user_data.name}<br><br>username : ${user_data.user_id} <br><br>รหัสยืนยันการสมัครสมาชิก : ${OTP_Schema.otp}`)
            return res.status(200).json({ result: 'nOK', message: 'please verify account by email in 15 minutes', data: userSchema})
        }

        await Otps.findByIdAndDelete(data._id);

        const payload = {
            id : user_data._id,
            user_id : user_data.user_id,
        }

        const token = jwt.sign(payload, '1h');

        res.status(200).header('Authorization', `Bearer ${token}`).json({ result: 'OK', message: 'success sign in', data: userSchema ,token:token});

    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};

exports.verifyteacher = async (req,res) => {
    const { error } = verifyValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {
        const email = req.body.email
        const otp = req.body.otp

        const data = await Otps.findOne({email: email});
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const user_data = await TeacherRegister.findOne({email: email});
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const userSchema = {
            _id: user_data._id,
            user_id : user_data.user_id,
            name : user_data.name,
            role : user_data.role,
            email : user_data.email,
            tel : user_data.tel,
            img_user : user_data.img_user
        }

        if(otp !== data.otp) return res.status(200).json({result: 'nOK', message: 'otp code not the same', data: {}});

        if(moment().isAfter(data.expired)) {
            const minutesToAdd = 15;
            const currentDate = new Date();
            const futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);

            const OTP_Schema = {
                email: user_data.email,
                otp: generateOtpcode(),
                expired: futureDate,
            }

            await Otps.findOneAndUpdate({email: user_data.email}, OTP_Schema);

            mailer(user_data.email,'Verify your account',`คุณ, ${user_data.name}<br><br>username : ${user_data.user_id} <br><br>รหัสยืนยันการสมัครสมาชิก : ${OTP_Schema.otp}`)
            return res.status(200).json({ result: 'nOK', message: 'please verify account by email in 15 minutes', data: userSchema})
        }

        await Otps.findByIdAndDelete(data._id);

        const payload = {
            id : user_data._id,
            user_id : user_data.user_id,
            role : user_data.role
        }

        const token = jwt.sign(payload, '1h');

        res.status(200).header('Authorization', `Bearer ${token}`).json({ result: 'OK', message: 'success sign in', data: userSchema ,token:token});

    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};

exports.verifyResendCodeStudent = async (req,res) => {
    const { error } = verifyValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {
        const email = req.body.email ;

        const data = await Otps.findOne({email: email});
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const user_data = await StudentRegister.findOne({email: email});
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const userSchema = {
            _id: user_data._id,
            user_id: user_data.user_id,
            name: user_data.name,
            student_id: user_data.student_id,
            teacher: user_data.teacher,
            major: user_data.teacher,
            email: user_data.email,
            tel: user_data.tel,
            img_user: user_data.img_user
        }


        const minutesToAdd = 15;
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);

        const OTP_Schema = {
            email: user_data.email,
            otp: generateOtpcode(),
            expired: futureDate,
        }

        await Otps.findOneAndUpdate({email: user_data.email}, OTP_Schema);

        mailer(user_data.email,'Verify your account',`คุณ, ${user_data.name}<br><br>username : ${user_data.user_id} <br><br>รหัสยืนยันการสมัครสมาชิก : ${OTP_Schema.otp}`)
        res.status(200).json({ result: 'OK', message: 'please verify account by email in 15 minutes', data: userSchema})

    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};

exports.verifyResendCodeTeacher = async (req,res) => {
    const { error } = verifyValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {
        const email = req.body.email ;

        const data = await Otps.findOne({email: email});
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const user_data = await TeacherRegister.findOne({email: email});
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const userSchema = {
            _id: user_data._id,
            user_id : user_data.user_id,
            name : user_data.name,
            role : user_data.role,
            email : user_data.email,
            tel : user_data.tel,
            img_user : user_data.img_user
        }

        const minutesToAdd = 15;
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);

        const OTP_Schema = {
            email: user_data.email,
            otp: generateOtpcode(),
            expired: futureDate,
        }

        await Otps.findOneAndUpdate({email: user_data.email}, OTP_Schema);

        mailer(user_data.email,'Verify your account',`คุณ, ${user_data.name}<br><br>username : ${user_data.user_id} <br><br>รหัสยืนยันการสมัครสมาชิก : ${OTP_Schema.otp}`)
        res.status(200).json({ result: 'OK', message: 'please verify account by email in 15 minutes', data: userSchema})

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

                const email = data.email

                const data_otp = await Otps.findOne({email: email});
                if (!data_otp) {

                    const userSchema = {
                        _id: data._id,
                        user_id: data.user_id,
                        name: data.name,
                        student_id: data.student_id,
                        teacher: data.teacher,
                        major: data.teacher,
                        email: data.email,
                        tel: data.tel,
                        img_user: data.img_user
                    }
                    const payload = {
                        id : data._id,
                        user_id : data.user_id
                    }
    
                    const token = jwt.sign(payload, '1h');
                    console.log(token)
    
                    res.status(200).header('Authorization', `Bearer ${token}`).json({ result: 'OK', message: 'success sign in', data: userSchema, token:token });
                } else {

                    //send verify email
                    const minutesToAdd = 15;
                    const currentDate = new Date();
                    const futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);
        
                    const OTP_Schema = {
                        email: data.email,
                        otp: generateOtpcode(),
                        expired: futureDate,
                    }

                    const hasOtp = await Otps.findOneAndUpdate({email: data.email}, OTP_Schema);
                    if (!hasOtp) {
                        await Otps.create(OTP_Schema);
                    }

                    const userSchema = {
                        _id: data._id,
                        user_id: data.user_id,
                        name: data.name,
                        student_id: data.student_id,
                        teacher: data.teacher,
                        major: data.teacher,
                        email: data.email,
                        tel: data.tel,
                        img_user: data.img_user
                    }

                    mailer(data.email,'Verify your account',`คุณ, ${data.name} <br><br>username : ${data.user_id} <br><br>รหัสยืนยันการสมัครสมาชิก : ${OTP_Schema.otp}`)
                    res.status(200).json({ result: 'Wait', message: 'please verify account by email in 15 minutes', data: userSchema})
                } 
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

exports.loginTeacher = async (req,res) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {
        
        const user_id = req.body.user_id
        const password = req.body.password

        const data = await TeacherRegister.findOne({ user_id: user_id} );

        if (data) {
            const isPasswordValid = await bcrypt.compare(password, data.password);
            if (isPasswordValid) {
                const email = data.email

                const data_otp = await Otps.findOne({email: email});
                if (!data_otp) {

                    const userSchema = {
                        _id : data._id,
                        user_id : data.user_id,
                        name : data.name,
                        role : data.role,
                        email : data.email,
                        tel : data.tel,
                        img_user : data.img_user
                    }
                    const payload = {
                        id : data._id,
                        user_id : data.user_id,
                        role : data.role
                    }
    
                    const token = jwt.sign(payload, '1h');
                    console.log(token)
    
                    res.status(200).header('Authorization', `Bearer ${token}`).json({ result: 'OK', message: 'success sign in', data: userSchema ,token:token});
                } else {

                    //send verify email
                    const minutesToAdd = 15;
                    const currentDate = new Date();
                    const futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);
        
                    const OTP_Schema = {
                        email: data.email,
                        otp: generateOtpcode(),
                        expired: futureDate,
                    }

                    const hasOtp = await Otps.findOneAndUpdate({email: data.email}, OTP_Schema);
                    if (!hasOtp) {
                        await Otps.create(OTP_Schema);
                    }
                    const userSchema = {
                        _id : data._id,
                        user_id : data.user_id,
                        name : data.name,
                        role : data.role,
                        email : data.email,
                        tel : data.tel,
                        img_user : data.img_user
                    }

                    mailer(data.email,'Verify your account',`คุณ, ${data.name} <br><br>username : ${data.user_id} <br><br>รหัสยืนยันการสมัครสมาชิก : ${OTP_Schema.otp}`)
                    res.status(200).json({ result: 'Wait', message: 'please verify account by email in 15 minutes', data: userSchema})
                } 
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

exports.StudentUploaded = async(req,res) => { 
    const user_id = req.body.user_id
    const test = req.body.test

    const { error } = fetchUserUploadedValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

try {

    const data = await StudentUploaded.findOne({ 
        user_id: user_id
    } )

    if(!data) return res.status(200).json({result: 'Not found', message: '', data: {}});

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


exports.TeacherUploaded = async(req,res) => { 
    const user_id = req.body.user_id
    const test = req.body.test

    const { error } = fetchUserUploadedValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

try {

    const data = await TeacherUploaded.findOne({ 
        user_id: user_id
    } )

    if(!data) return res.status(200).json({result: 'Not found', message: '', data: {}});

    if (data.register_check == true) return res.status(200).json({result: 'nOK', message: 'เป็นสมาชิกอยู่แล้ว', data: {}});
    
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

exports.forgotpasswordstudent = async (req,res) => {

    const userid = req.body.user_id

    const { error } = forgotPasswordValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {

        const newpassword = generatePassword()

        const user_data = await StudentRegister.findOne({user_id: userid})
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        user_data.password = await bcrypt.hash(newpassword, 8);

        const newData = await StudentRegister.findOneAndUpdate({user_id: userid}, user_data)

        const userSchema = {
            _id: user_data._id,
            user_id: user_data.user_id,
            name: user_data.name,
            student_id: user_data.student_id,
            teacher: user_data.teacher,
            major: user_data.teacher,
            email: user_data.email,
            tel: user_data.tel,
            img_user: user_data.img_user
        }

        mailer(user_data.email,'ลืมรหัสผ่าน',`สวัสดี คุณ , ${user_data.name} <br>รหัสผ่านเว็บไซต์ COSCI-ระบบบริหารจัดการการฝึกงาน ของคุณมีการเปลี่ยนแปลงตามที่คุณร้องขอ รหัสผ่านใหม่ของคุณ คือ <h1><b><mark>${newpassword}</mark></b></h1> <br>ใช้รหัสผ่านนี้ในการเข้าสู่ระบบ และคุณสามารถเปลี่ยนแปลงรหัสผ่านของคุณได้หลังจากเข้าเว็บไซต์`)

        res.status(200).json({result: 'OK', message: 'success', data: userSchema});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.forgotpasswordteacher = async (req,res) => {
    const userid = req.body.user_id

    const { error } = forgotPasswordValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {

        const newpassword = generatePassword()

        const user_data = await TeacherRegister.findOne({user_id: userid})
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        user_data.password = await bcrypt.hash(newpassword, 8);

        const newData = await TeacherRegister.findOneAndUpdate({user_id: userid}, user_data)

        const userSchema = {
            _id : user_data._id,
            user_id : user_data.user_id,
            name : user_data.name,
            role : user_data.role,
            email : user_data.email,
            tel : user_data.tel,
            img_user : user_data.img_user
        }

        mailer(user_data.email,'ลืมรหัสผ่าน',`สวัสดี คุณ , ${user_data.name} <br>รหัสผ่านเว็บไซต์ COSCI-ระบบบริหารจัดการการฝึกงาน ของคุณมีการเปลี่ยนแปลงตามที่คุณร้องขอ รหัสผ่านใหม่ของคุณ คือ <h1><b><mark>${newpassword}</mark></b></h1> <br>ใช้รหัสผ่านนี้ในการเข้าสู่ระบบ และคุณสามารถเปลี่ยนแปลงรหัสผ่านของคุณได้หลังจากเข้าเว็บไซต์`)

        res.status(200).json({result: 'OK', message: 'success', data: userSchema});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}




