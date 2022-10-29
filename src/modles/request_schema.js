const mongoose = require("mongoose")

const schema = mongoose.schema ({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
    user_id : String,
    id_event : {type: mongoose.Schema.Types.ObjectId, required: true},
    password : String,
    start_date : Date,
    end_date : Date,
    uploaded_img : String,
    uploaded_pdf : String,
    date_request : {type: Date, default: Date.now},
    status_request : String,
    type_request : String ,
    permissions_request : String,
})

schema.index({_id: 1},{ unique: true})
module.exports = mongoose.model("request",schema)
