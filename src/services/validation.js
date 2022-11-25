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

const registerStudentValidation = (data) => {
    const schema = Joi.object({
        user_id : Joi.string()
                .length(11)
                .required(),
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

const loginValidation = data => {
    const schema = Joi.object({
            user_id : Joi.string()
                    .required(),
            password : Joi.string()
                    .required()
    });
    return schema.validate(data);
};

const fetchUserUploadedValidation = data => {
        const schema = Joi.object({
                user_id : Joi.string()
                        .required(),
        });
        return schema.validate(data);
};


module.exports.registerTeacherValidation = registerTeacherValidation;
module.exports.registerStudentValidation = registerStudentValidation;
module.exports.createRequestValidation = createRequestValidation;
module.exports.createEventValidation = createEventValidation;
module.exports.loginValidation = loginValidation;
module.exports.fetchUserUploadedValidation = fetchUserUploadedValidation;