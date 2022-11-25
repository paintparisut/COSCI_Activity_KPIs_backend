const Event = require('../models/event_schema');
const Request = require('../models/request_schema');
const StudentRegister = require('../models/student_registered_schema');
const {createRequestValidation} = require('../services/validation');


exports.reqHistory = async(req,res) => { 
    const userid = req.body.user_id; //edit here
    try {
        // const user_data = await Event.findById(userid);
        // if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

        const data = await Request.find({ 
            permissions_request: "student" ,
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

exports.createRequest = async(req,res) => {

    const { error } = createRequestValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

    try {

        req.body.date_request = Date.now()
        const data = await Request.create(req.body)

    
        res.status(200).json({result: 'OK', message: 'success create event', data: data});

    }catch (e){
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.getactivityactive = async(req,res) => { 
    // const event = req.event
try {
    // const user_data = await Event.findById(event);
    // if(!user_data) return res.status(404).json({result: 'Not found', message: 'validation', data: {}});

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