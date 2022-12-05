const generator = require('generate-password');
const nodemailer = require('nodemailer');
const NodeCache = require('node-cache')
const Event = require('../models/event_schema')
const Request = require('../models/request_schema')


const eventCache = new NodeCache({ stdTTL: 604800 }) //7วัน

const getEvent = async () => {

    if (eventCache.has('event')) {
        return eventCache.get('event')
    }

    try {
        const data = await Event.find()
        eventCache.set('event', data)
        return data
    } catch (e) {
        return '500'
    }
}

const getRequest = async () => {

    if (eventCache.has('request')) {
        return eventCache.get('request')
    }

    try {
        const data = await Request.find()
        eventCache.set('request', data)
        return data
    } catch (e) {
        return '500'
    }
}


const generatePassword = () => {
    return generator.generate({
        length: 10,
        numbers: true
    });
};

const generateOtpcode = () => {
    return generator.generate({
        length: 6,
        numbers: true,
        exclude: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    });
};

const mailer = (to,subject,html) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        service: 'gmail',
        securce: true,
        auth: {
          user: 'cosci.activitykpi@gmail.com',
          pass: 'mwkworpvtnzokyaa',
        },
        tls: {
          rejectUnauthorized: false,
        }
    });

    let mailOptions = {
        from: 'cosci.activitykpi@gmail.com',
        to: to,
        subject: `COSCI-ACTIVITYKPI ${subject}`,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("failure",error.message);
        }
        console.log(`success send email`)
    });
};

exports.getEvent = getEvent;
exports.getRequest = getRequest;
exports.generateOtpcode = generateOtpcode;
exports.mailer = mailer;
exports.generatePassword = generatePassword;