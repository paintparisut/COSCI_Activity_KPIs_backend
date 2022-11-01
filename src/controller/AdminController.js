const Event = require('../modles/event_schema');
const {createEventValidation} = require('../services/validation');

exports.upload = async(req,res) => {
    const { error } = createEventValidation(req.body);

}