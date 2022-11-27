const Joi = require('@hapi/joi');

const changePasswordValidation = data => {
    const schema = Joi.object({
            oldpassword : Joi.string()
                        .min(6)
                        .max(32)
                        .required(),
            password : Joi.string()
                     .min(6)
                     .max(32)
                     .required(),
            confirmpassword : Joi.string()
                            .valid(Joi.ref('password'))
                            .required(),
    });
    return schema.validate(data);
};

module.exports.changePasswordValidation = changePasswordValidation;
