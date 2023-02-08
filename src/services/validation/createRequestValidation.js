const Joi = require('@hapi/joi');

const createRequestValidation = (data) => {
    const schema = Joi.object({
        status_request : Joi.string()
                        .required(),
    });
    return schema.validate(data);
};

module.exports.createRequestValidation = createRequestValidation;