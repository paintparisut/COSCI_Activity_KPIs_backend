const Joi = require('@hapi/joi');

const createRequestValidation = (data) => {
    const schema = Joi.object({
        user_id : Joi.string()
                .required(),
        id_event : Joi.string()
                .required(),
        start_date : Joi.date(),
        end_date : Joi.date(),
        uploaded_img : Joi.string(),
        uploaded_pdf : Joi.string(),
        date_request : Joi.date(),
        status_request : Joi.string()
                        .required(),
        type_request : Joi.string()
                        .required(),
        permissions_request : Joi.string()
                        .required(),
    });
    return schema.validate(data);
};

module.exports.createRequestValidation = createRequestValidation;