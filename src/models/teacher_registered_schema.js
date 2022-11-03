const mongoose = require("mongoose")

const schema = mongoose.Schema ({
    user_id : String,
    name : String,
    password : String,
    role : String,
    email : String,
    tel : String
});

schema.index({user_id: 1},{unique: true})
module.exports = mongoose.model("teacher_registered",schema)
