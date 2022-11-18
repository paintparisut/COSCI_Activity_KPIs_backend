const Joi = require('@hapi/joi');

const createEventValidation = (data) => {
    const schema = Joi.object({
        name_event : Joi.string()
                    .required(),
        detail_event : Joi.string()
                    .required(),
        star_date : Joi.date(),
        end_date : Joi.date(),
        posted_timestamp : Joi.date(),
        event_type : Joi.string(),
        event_img : Joi.string(),
        activity_hour : Joi.number()
                        .max(99)
                        .min(0)
                        .required(),
        event_status : Joi.boolean()
                        .required(),
        permissions_type : Joi.string()
                            .required()

    });
    return schema.validate(data);
};

const createRequestValidation = (data) => {
    const schema = Joi.object({

    });
    return schema.validate(data);
};

const registerTeacherValidation = (data) => {
    const schema = Joi.object({

    });
    return schema.validate(data);
};
const registerStudentValidation = (data) => {
    const schema = Joi.object({

    });
    return schema.validate(data);
};

module.exports.registerTeacherValidation = registerTeacherValidation;
module.exports.registerStudentValidation = registerStudentValidation;
module.exports.createRequestValidation = createRequestValidation;
module.exports.createEventValidation = createEventValidation;
