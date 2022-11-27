const Joi = require('@hapi/joi');

const forgotPasswordValidation = data => {
    const schema = Joi.object({
            user_id : Joi.string()
                    .required(),
    });
    return schema.validate(data);
};

module.exports.forgotPasswordValidation = forgotPasswordValidation;
