const Joi = require('@hapi/joi');

const fetchUserUploadedValidation = data => {
    const schema = Joi.object({
            user_id : Joi.string()
                    .required(),
    });
    return schema.validate(data);
};
module.exports.fetchUserUploadedValidation = fetchUserUploadedValidation;