const Event = require('../models/event_schema');
const Request = require('../models/request_schema');
const bcrypt = require('bcryptjs');
const TeacherRegister = require('../models/teacher_registered_schema');
const {createRequestValidation} = require('../services/validation/createRequestValidation');
const {changePasswordValidation} = require('../services/validation/changPasswordValidate');
const { id } = require('@hapi/joi/lib/base');

exports.reqHistory = async(req,res) => { 
    const userid = req.user_id 
    try {
        const user_data = await Event.find({user_id:userid});
        if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

        const data = await Request.find({ 
            permissions_request: "teacher" ,
            user_id: userid
        } )

        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const req_data = []

        for(let i = 0; i < data.length; i++) {
            const schema = {
                _id: data[i]._id,
                id_event: data[i].id_event,
                user_id: data[i].user_id,
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

        res.status(200).json({result: 'OK', message: 'success get student req history', data: {data: req_data}});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.getkpiactive = async(req,res) => { 
    const userid = req.userId 
try {
    const user_data = await TeacherRegister.findById(userid);
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

exports.changepassword = async (req,res) => {

    const userid = req.userId

    const { error } = changePasswordValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

    try {

        const oldpassword = req.body.oldpassword
        const newpassword = req.body.password

        const data = await TeacherRegister.findById(userid)
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        if (data) {
            console.log(data)
            const isPasswordValid = await bcrypt.compare(oldpassword, data.password);
            if (isPasswordValid) {

                data.password = await bcrypt.hash(newpassword, 8);
                const newData = await TeacherRegister.findByIdAndUpdate(userid, data)

                res.status(200).json({result: 'OK', message: 'success change password', data: data});

            } else {
                res.status(200).json({ result: 'nOK', message: 'invalid password', data: {}});
            }
    } else {
        res.status(404).json({ result: 'nOK', message: 'data not found', data: {}});
    }
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.createRequest = async(req,res) => {

    const userId = req.userId
    const { error } = createRequestValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

    try {
        
        const user_data = await TeacherRegister.findById(userId)
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const event_data = await Event.findById(req.body.id_event)
        if(!event_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        req.body.date_request = Date.now()
        req.body.permissions_request = "teacher"

        const schema = {
            user : {
                id_user : user_data._id,
                user_id : user_data.user_id,
                name : user_data.name,
            },
            event : {
                id_event : event_data._id,
                name_event : event_data.name_event,
                detail_event : event_data.detail_event,
                start_date : event_data.start_date,
                end_date : event_data.end_date,
                posted_timestamp : event_data.posted_timestamp,
                event_type : event_data.event_type,
                event_img : event_data.event_img,
                activity_hour : event_data.activity_hour,
                event_status : event_data.event_status ,
            },
            start_date : req.body.start_date,
            end_date : req.body.end_date,
            uploaded_img : req.body.uploaded_img,
            uploaded_pdf : req.body.uploaded_pdf,
            status_request : req.body.status_request,
            type_request : req.body.type_request ,
            permissions_request : req.body.permissions_request,
        }
        const data = await Request.create(schema)
    
        res.status(200).json({result: 'OK', message: 'success create event', data: data});

    }catch (e){
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.getsinglekpi = async(req,res) => { 
    const userid = req.userId 
    const idparams = req.params.id

    if (!idparams) return res.status(400).json({result: 'Bad request', message: ''});

try {
    const user_data = await TeacherRegister.findById(userid);
    if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

    const data = await Event.findOne({ 
        _id: idparams
     } )

    if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

    console.log("eiei",idparams)
    res.status(200).json({result: 'OK', message: 'success get single kpisdata', data: data});
} catch (e) {
    res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
}
}