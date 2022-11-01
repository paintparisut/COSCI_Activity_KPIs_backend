const mongoose = require("mongoose")

const schema = mongoose.Schema ({
    user_id : String,
    name : String,
    password : String,
    student_id : String,
    teacher : String,
    major : String,
    email : String,
    tel : String,
    teacher : String,
    img_user : {type:String, default:"userimgdefault.jpg"}
});

schema.index({user_id: 1,student_id: 4},{ unique: true ,unique: true})
module.exports = mongoose.model("student_registered",schema)
