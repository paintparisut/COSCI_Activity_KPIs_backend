const mongoose = require("mongoose")

const schema = mongoose.Schema ({
    user : {
        id_user : String,
        user_id : String,
        name : String,
        student_id : String,
    },
    event : {
        id_event : String,
        name_event : String,
        detail_event : String,
        start_date : Date,
        end_date : Date,
        posted_timestamp : {type: Date, default: Date.now},
        event_type : String,
        event_img : {type:String, default:"imgactivity.png"},
        event_img_list : [String],
        activity_hour : Number,
        event_status : Boolean ,
    },
    start_date : Date,
    end_date : Date,
    uploaded_img : String,
    uploaded_pdf : String,
    date_request : {type: Date, default: Date.now},
    status_request : String,
    type_request : String ,
    permissions_request : String,
});

module.exports = mongoose.model("request",schema)
