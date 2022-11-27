const Joi = require('@hapi/joi');

const verifyValidation = data => {
    const schema = Joi.object({
            email: Joi.string()
                    .email()
                    .required(),
            otp: Joi.string().regex(/^[0-9]{6}$/)
    });
    return schema.validate(data);
};

module.exports.verifyValidation = verifyValidation