const Joi = require('@hapi/joi');

const registerTeacherValidation = (data) => {
    const schema = Joi.object({
        user_id : Joi.string()
                    .required(),
        name : Joi.string()
                .required(),
        password : Joi.string()
                    .min(6)
                    .max(32)
                    .required(),
        role : Joi.string()
                .required(),
        email : Joi.string()
                .email()
                .required(),
        tel : Joi.string()
                .length(10)
                .pattern(/^[0-9]+$/)
                .required(),
    });
    return schema.validate(data);
};

module.exports.registerTeacherValidation = registerTeacherValidation;