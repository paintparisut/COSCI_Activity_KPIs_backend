const multer = require('multer');
const Event = require('../models/event_schema');
const Request = require('../models/request_schema');
const StudentRegister = require('../models/student_registered_schema');
const TeacherRegister = require('../models/teacher_registered_schema');
const {createEventValidation} = require('../services/validation/createEventValidation');
const {createRequestValidation} = require('../services/validation/createRequestValidation');
const {getEvent,getRequest} = require('../services/utilities');

const currentTime = Date.now();

exports.getEventData = async (req,res) => {

    const eventData = await getEvent();
    const requestData = await getRequest();
    if (eventData === '500'||requestData === '500') return res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    
    const formData = {
        event: eventData,
        request: requestData
    }
    
    res.status(200).json({result: 'OK', message: 'success get form data', data: formData});
};


exports.uploadevent = async(req,res) => {   //+ img

    const { error } = createEventValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

    try {
        //check user

        req.body.posted_timestamp = currentTime
        const data = await Event.create(req.body)

        res.status(200).json({result: 'OK', message: 'success create event', data: data});

    }catch (e){
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.getkpi = async(req,res) => { 
        const userId = req.userId

    try {

        const user_data = await TeacherRegister.findById(userId);
        if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

        const data = await Event.find({ permissions_type: "teacher" } )
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const kpi_data = []

        for(let i = 0; i < data.length; i++) {
            const schema = {
                _id: data[i]._id,
                name_event: data[i].name_event,
                detail_event: data[i].detail_event,
                start_date: data[i].start_date,
                end_date: data[i].end_date,
                posted_timestamp: data[i].posted_timestamp,
                event_type: data[i].event_type,
                event_img: data[i].event_img,
                event_img_list : data[i].event_img_list,
                activity_hour: data[i].activity_hour,
                event_status: data[i].event_status,
                permissions_type: data[i].permissions_type
            }
            kpi_data.push(schema)
        }

        res.status(200).json({result: 'OK', message: 'success get all kpisdata', data: {data: kpi_data}});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.getactivity = async(req,res) => { 
        const userId = req.userId

    try {

        // const user_data = await TeacherRegister.findById(userId);
        // if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

        const data = await Event.find({ permissions_type: "student" } )

        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const act_data = []

        for(let i = 0; i < data.length; i++) {
            const schema = {
                _id: data[i]._id,
                name_event: data[i].name_event,
                detail_event: data[i].detail_event,
                start_date: data[i].start_date,
                end_date: data[i].end_date,
                posted_timestamp: data[i].posted_timestamp,
                event_type: data[i].event_type,
                event_img: data[i].event_img,
                event_img_list: data[i].event_img_list,
                activity_hour: data[i].activity_hour,
                event_status: data[i].event_status,
                permissions_type: data[i].permissions_type
            }
            act_data.push(schema)
        }
        res.status(200).json({result: 'OK', message: 'success get all activity data', data: {data: act_data}});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.getrequeststudent = async(req,res) => { 
        const userId = req.userId

    try {

        const user_data = await TeacherRegister.findById(userId);
        if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

        const data = await Request.find({ permissions_request: "student" } )

        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const req_data = []

        for(let i = 0; i < data.length; i++) {
            const schema = {
                _id: data[i]._id,
                user : {
                    id_user : data._id,
                    user_id : data.user_id,
                    name : data.name,
                },
                event : {
                    id_event : data._id,
                    name_event : data.name_event,
                    detail_event : data.detail_event,
                    start_date : data.start_date,
                    end_date : data.end_date,
                    posted_timestamp : data.posted_timestamp,
                    event_type : data.event_type,
                    event_img : data.event_img,
                    activity_hour : data.activity_hour,
                    event_status : data.event_status ,
                },
                start_date: data[i].start_date,
                end_date: data[i].end_date,
                uploaded_img: data[i].uploaded_img,
                uploaded_pdf: data[i].uploaded_pdf,
                date_request: data[i].date_request,
                status_request: data[i].status_request,
                type_request: data[i].type_request,
                permissions_request: data[i].permissions_request
            }
            req_data.push(schema)
        }

        res.status(200).json({result: 'OK', message: 'success get all student req', data: {data: req_data}});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.getrequestteacher = async(req,res) => { 
        const userId = req.userId

    try {

        const user_data = await TeacherRegister.findById(userId);
        if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

        const data = await Request.find({ permissions_request: "teacher" } )
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const req_data = []

        for(let i = 0; i < data.length; i++) {
            const schema = {
                _id: data[i]._id,
                user : {
                    id_user : data._id,
                    user_id : data.user_id,
                    name : data.name,
                },
                event : {
                    id_event : data._id,
                    name_event : data.name_event,
                    detail_event : data.detail_event,
                    start_date : data.start_date,
                    end_date : data.end_date,
                    posted_timestamp : data.posted_timestamp,
                    event_type : data.event_type,
                    event_img : data.event_img,
                    activity_hour : data.activity_hour,
                    event_status : data.event_status ,
                },
                start_date: data[i].start_date,
                end_date: data[i].end_date,
                uploaded_img: data[i].uploaded_img,
                uploaded_pdf: data[i].uploaded_pdf,
                date_request: data[i].date_request,
                status_request: data[i].status_request,
                type_request: data[i].type_request,
                permissions_request: data[i].permissions_request
            }
            req_data.push(schema)
        }

        res.status(200).json({result: 'OK', message: 'success get all teacher req', data: {data: req_data}});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.getkpiactive = async(req,res) => { 
        const userId = req.userId
    
    try {
        const user_data = await TeacherRegister.findById(userId);
        if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

    const data = await Event.find({ 
        permissions_type: "teacher",
        event_status: true
     } )

    if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

    const kpi_data = []

    for(let i = 0; i < data.length; i++) {
        const schema = {
            _id: data[i]._id,
            name_event: data[i].name_event,
            detail_event: data[i].detail_event,
            start_date: data[i].start_date,
            end_date: data[i].end_date,
            posted_timestamp: data[i].posted_timestamp,
            event_type: data[i].event_type,
            event_img: data[i].event_img,
            event_img_list: data[i].event_img_list,
            activity_hour: data[i].activity_hour,
            event_status: data[i].event_status,
            permissions_type: data[i].permissions_type
        }
        kpi_data.push(schema)
    }

    res.status(200).json({result: 'OK', message: 'success get all kpisdata', data: {data: kpi_data}});
} catch (e) {
    res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
}
}

exports.getactivityactive = async(req,res) => { 
        const userId = req.userId

    try {
        const user_data = await TeacherRegister.findById(userId);
        if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

    const data = await Event.find({ 
        permissions_type: "student",
        event_status: true
     } )

    if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

    const act_data = []

    for(let i = 0; i < data.length; i++) {
        const schema = {
            _id: data[i]._id,
            name_event: data[i].name_event,
            detail_event: data[i].detail_event,
            start_date: data[i].start_date,
            end_date: data[i].end_date,
            posted_timestamp: data[i].posted_timestamp,
            event_type: data[i].event_type,
            event_img: data[i].event_img,
            event_img_list :data[i].event_img_list,
            activity_hour: data[i].activity_hour,
            event_status: data[i].event_status,
            permissions_type: data[i].permissions_type
        }
        act_data.push(schema)
    }
    res.status(200).json({result: 'OK', message: 'success get all activity data', data: {data: act_data}});
} catch (e) {
    res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
}
}

exports.studentCRUD = async(req,res) => { 
        const userId = req.userId
        console.log(userId)
    try {
    const user_data = await TeacherRegister.findById(userId);
    if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

    const data = await StudentRegister.find()
    if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

    const student_data = []

    for(let i = 0; i < data.length; i++) {
        const schema = {
            _id: data[i]._id,
            user_id: data[i].user_id,
            name: data[i].name,
            student_id: data[i].student_id,
            teacher: data[i].teacher,
            major: data[i].major,
            email: data[i].email,
            img_user: data[i].img_user,
            tel: data[i].tel
        }
        student_data.push(schema)
    }

    res.status(200).json({result: 'OK', message: 'success get student data', data: {data: student_data}});
} catch (e) {
    res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
}
}

exports.teacherCRUD = async(req,res) => { 
        const userId = req.userId
        console.log(userId)
       
    try {
        const user_data = await TeacherRegister.findById(userId);
        if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

    const data = await TeacherRegister.find()

    if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

    const teacher_data = []

    for(let i = 0; i < data.length; i++) {
        const schema = {
            _id: data[i]._id,
            user_id: data[i].user_id,
            name: data[i].name,
            role: data[i].role,
            email: data[i].email,
            img_user: data[i].img_user,
            tel: data[i].tel
        }
        teacher_data.push(schema)
    }

    res.status(200).json({result: 'OK', message: 'success get teacher data', data: {data: teacher_data}});
} catch (e) {
    res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
}
}


exports.editevent = async (req,res) => {

    const id = req.headers.id_event

    const { error } = createEventValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {

        const data = await Event.findById(id)
        
        if(!data) return res.status(404).json({result: 'Not found', message: 'not found event', data: {}});

        data.name_event = req.body.name_event,
        data.detail_event = req.body.detail_event,
        data.start_date = req.body.start_date,
        data.end_date = req.body.end_date,
        data.posted_timestamp = currentTime,
        data.event_type = req.body.event_type,
        data.event_img = req.body.event_img,
        data.event_img_list = req.body.event_img_list,
        data.activity_hour = req.body.activity_hour,
        data.event_status = req.body.event_status

        const newData = await Event.findByIdAndUpdate(id, data)

        const schema = {
            name_event : data.name_event,
            detail_event : data.detail_event,
            start_date : data.start_date,
            end_date : data.end_date,
            posted_timestamp : data.posted_timestamp,
            event_type : data.event_type,
            event_img : data.event_img,
            event_img_list : data.event_img_list,
            activity_hour : data.activity_hour,
            event_status : data.event_status,
            permissions_type : data.per,
        }

        res.status(200).json({result: 'OK', message: 'success edit event', data: schema});
        
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.updateReq = async (req,res) => {

    const id = req.headers.id_req //edit

    const { error } = createRequestValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {

        const data = await Request.findById(id)
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        data.status_request = req.body.status_request

        const newData = await Request.findByIdAndUpdate(id, data)

        const schema = {
            user : {
                id_user : data._id,
                user_id : data.user_id,
                name : data.name,
            },
            event : {
                id_event : data._id,
                name_event : data.name_event,
                detail_event : data.detail_event,
                start_date : data.start_date,
                end_date : data.end_date,
                posted_timestamp : data.posted_timestamp,
                event_type : data.event_type,
                event_img : data.event_img,
                activity_hour : data.activity_hour,
                event_status : data.event_status ,
            },
            start_date : data.start_date,
            end_date : data.end_date,
            uploaded_img : data.uploaded_img,
            uploaded_pdf : data.uploaded_pdf,
            date_request : data.date_request,
            status_request : data.status_request,
            type_request : data.type_request,
            permissions_request : data.permissions_request,
        }

        res.status(200).json({result: 'OK', message: 'success update req', data: schema});
        
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}