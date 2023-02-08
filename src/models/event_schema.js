const mongoose = require("mongoose")

const schema = mongoose.Schema ({
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
    permissions_type : String,
});

module.exports = mongoose.model("events",schema)
