const mongoose = require("mongoose")

const schema = mongoose.Schema ({
    id_user : String,
    user_id : String,
    name : String,
    student_id : String,
    id_event : String,
    name_event : String,
    event_img : {type:String, default:"imgactivity.png"},//new
    event_type : String,
    activity_hour : String,
    start_date : Date,
    end_date : Date,
    uploaded_img : [String],
    uploaded_pdf : String,
    date_request : {type: Date, default: Date.now},
    status_request : String,
    type_request : String ,
    permissions_request : String,
});

module.exports = mongoose.model("request",schema)
