const Joi = require('@hapi/joi');

const createRequestValidation = (data) => {
    const schema = Joi.object({
        id_event : Joi.string(),
        start_date: Joi.date(),
        end_date: Joi.date(),
        type_request: Joi.string(),
        uploaded_img: Joi.array(),
        uploaded_pdf: Joi.string(),
        status_request : Joi.string()
                        .required(),
    });
    return schema.validate(data);
};

module.exports.createRequestValidation = createRequestValidation;