const mongoose = require("mongoose")

const schema = mongoose.schema ({
    user_id : String,
    name : String,
    role : String,
    email : String,
    tel : String,
    register_check:{type:Boolean, default:false}
})

schema.index({user_id: 1},{ unique: true })
module.exports = mongoose.model("teacher_uploaded",schema)
