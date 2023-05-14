const Event = require('../models/event_schema');
const Request = require('../models/request_schema');
const bcrypt = require('bcryptjs');
const StudentRegister = require('../models/student_registered_schema');
const {createRequestValidation} = require('../services/validation/createRequestValidation');
const {changePasswordValidation} = require('../services/validation/changPasswordValidate');


exports.reqHistory = async(req,res) => { 
    const userid = req.user_id 
    console.log(userid)
    try {
        const user_data = await Event.find({user_id:userid});
        if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

        const data = await Request.find({ 
            permissions_request: "student" ,
            "user.user_id": userid
        } )

        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const req_data = []

        for(let i = 0; i < data.length; i++) {
            const schema = {
                _id: data[i]._id,
                id_user : data[i].id_user,
                user_id : data[i].user_id,
                name : data[i].name,
                student_id : data[i].student_id,
                id_event : data[i].id_event,
                name_event : data[i].name_event,
                event_img : data[i].event_img,
                event_type : data[i].event_type,
                activity_hour : data[i].activity_hour,        
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

exports.createRequest = async(req,res) => {

    const userId = req.userId
    const { error } = createRequestValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

    try {
        
        const user_data = await StudentRegister.findById(userId)
        if(!user_data) return res.status(404).json({result: 'Not found', message: '1', data: {}});

        const event_data = await Event.findById(req.body.id_event)
        if(!event_data) return res.status(404).json({result: 'Not found', message: '2', data: {}});

        req.body.date_request = Date.now()
        req.body.permissions_request = "student"

  
        const schema = {
            id_user : user_data._id,
            user_id : user_data.user_id,
            name : user_data.name,
            student_id : user_data.student_id,
            id_event : event_data._id,
            name_event : event_data.name_event,
            event_img : event_data.event_img,
            event_type : event_data.event_type,
            activity_hour : event_data.activity_hour,
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

exports.getactivityactive = async(req,res) => { 
    const userid = req.userId 

try {
    const user_data = await StudentRegister.findById(userid);
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
            event_img_list : data[i].event_img_list,
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

exports.changepassword = async (req,res) => {

    const userid = req.userId

    const { error } = changePasswordValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

    try {

        const oldpassword = req.body.oldpassword
        const newpassword = req.body.password

        const data = await StudentRegister.findById(userid)
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        if (data) {
            console.log(data)
            const isPasswordValid = await bcrypt.compare(oldpassword, data.password);
            if (isPasswordValid) {

                data.password = await bcrypt.hash(newpassword, 8);
                const newData = await StudentRegister.findByIdAndUpdate(userid, data)

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


exports.getsingleevent = async(req,res) => { 
    const userid = req.userId 
    const idparams = req.params.id


    if (!idparams) return res.status(400).json({result: 'Bad request', message: ''});

try {
    const user_data = await StudentRegister.findById(userid);
    if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

    const data = await Event.findOne({ 
        _id: idparams
     } )

    if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

    console.log("eiei",idparams)
    res.status(200).json({result: 'OK', message: 'success get single event', data: data});
} catch (e) {
    res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
}
}

exports.deletereq = async (req,res) => {

    const id = req.body._id

    try {

        const data = await Request.findById(id)
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        await Request.findByIdAndDelete(id)

        res.status(200).json({result: 'OK', message: 'success delete request',data});
        
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}