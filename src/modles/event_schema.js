const mongoose = require("mongoose")

const schema = mongoose.schema ({
    id_event: {type: mongoose.Schema.Types.ObjectId, auto: true },
    name_event : String,
    detail_event : String,
    start_date : Date,
    end_date : Date,
    posted_timestamp : {type: Date, default: Date.now},
    event_type : String,
    event_img : String,
    activity_hour : Number,
    event_type : String ,
    permissions_type : String,
})

schema.index({id_event: 1},{ unique: true})
module.exports = mongoose.model("request",schema)
