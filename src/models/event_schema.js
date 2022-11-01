const mongoose = require("mongoose")

const schema = mongoose.Schema ({
    name_event : String,
    detail_event : String,
    start_date : Date,
    end_date : Date,
    posted_timestamp : {type: Date, default: Date.now},
    event_type : String,
    event_img : {type:String, default:"imgactivity.png"},
    activity_hour : Number,
    event_type : String ,
    permissions_type : String,
});

schema.index({id_event: 1},{ unique: true})
module.exports = mongoose.model("request",schema)
