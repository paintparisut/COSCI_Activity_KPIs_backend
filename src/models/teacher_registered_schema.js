const mongoose = require("mongoose")

const schema = mongoose.Schema ({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true },
    user_id : String,
    name : String,
    password : String,
    role : String,
    email : String,
    tel : String
});

schema.index({user_id: 2,email: 6},{ unique: true ,unique: true})
module.exports = mongoose.model("teacher_registered",schema)
