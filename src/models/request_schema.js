const mongoose = require("mongoose")

const schema = mongoose.Schema ({
    user_id : String,
    id_event : {type: mongoose.Schema.Types.String, required: true},
    user_id : String,
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
