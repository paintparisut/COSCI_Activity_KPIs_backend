const mongoose = require("mongoose")

const schema = mongoose.Schema ({
    user_id : String,
    name : String,
    major : String,
    teacher : String,
    register_check:{type:Boolean, default:false}
});

schema.index({user_id: 1},{ unique: true })
module.exports = mongoose.model("student_uploaded",schema)
