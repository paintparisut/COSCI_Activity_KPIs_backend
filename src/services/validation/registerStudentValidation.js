const Joi = require('@hapi/joi');

const registerStudentValidation = (data) => {
    const schema = Joi.object({
        name : Joi.string()
                .required(),
        password : Joi.string()
                .min(6)
                .max(32)
                .required(),
        student_id : Joi.string()
                .length(11)
                .required(),
        teacher :  Joi.string()
                .required(),
        major :  Joi.string()
                .required(),
        email :  Joi.string()
                 .email()
                .required(),
        tel :  Joi.string()
                .length(10)
                .pattern(/^[0-9]+$/)
                .required(),
        teacher :  Joi.string()
                 .required(),
        img_user : Joi.string(),
    });
    return schema.validate(data);
};

module.exports.registerStudentValidation = registerStudentValidation;
