const Event = require('../models/event_schema');
const {createEventValidation} = require('../services/validation');

exports.uploadevent = async(req,res) => {

    const { error } = createEventValidation(req.body);
    if (error) return res.status(200).json({result:'nOK',masage:error.details[0].message, data:{}});

    try {
        const user_data = await Event.findById(userID);
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const schema = {
        
        }

        res.status(200).json({result: 'OK', message: 'success create event', data: data});

    }catch (e){
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }

}

exports.getkpi = async(req,res) => { 
    const event = req.event

    try {
        // const user_data = await Event.findById(event);
        // if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        // const data = await Event.find({$: [
        //     { permissions_type: "teacher" },
        // ]})
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const kpi_data = []

        for(let i = 0; i < data.length; i++) {
            const schema = {
                id: data[i]._id,
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

        const sorted_data = _data.sort((a, b) => a.moment.valueOf() - b.moment.valueOf())

        res.status(200).json({result: 'OK', message: 'success get all data', data: {transactions: sorted_data.reverse()}});
        
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}