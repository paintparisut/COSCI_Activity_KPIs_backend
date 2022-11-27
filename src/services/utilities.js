const generator = require('generate-password');
const nodemailer = require('nodemailer');


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


exports.generateOtpcode = generateOtpcode;
exports.mailer = mailer;
exports.generatePassword = generatePassword;