const Joi = require('@hapi/joi');

const createEventValidation = (data) => {
    const schema = Joi.object({
        name_event : Joi.string()
                    .required(),
        detail_event : Joi.string()
                    .required(),
        star_date : Joi.date()
                    .required(),
        end_date : Joi.date()
                    .required(),
        posted_timestamp : Joi.date()
                            .greater('now')
                            .required(),
        event_type : Joi.string()
                        .required(),
        event_img : Joi.string(),
        activity_hour : Joi.number()
                        .max(99)
                        .min(0)
                        .required(),
        permissions_type : Joi.string()
                            .required()

    });
    return schema.validate(data);
};

module.exports.createEventValidation = createEventValidation;
