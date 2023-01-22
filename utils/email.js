const express = require('express');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const pathView = path.resolve(__dirname, '../utils/mail/templates/view');
const partialsView = path.resolve(__dirname, '../utils/mail/templates/partials');
module.exports = {
    sendMail: (value, from, to, sub) => {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_POST,
            auth: {
                user: process.env.SMTP_USER,
                pass: SMTP_PASSWORD
            }
        });
        transporter.use('compile', hbs({
            viewEngine: {
                extName: '.handlebars',
                layoutsDir: pathView,
                defaultLayout: false,
                partialsDir: partialsView,
                express
            },
            viewPath: pathView,
            extName: '.handlebars'
        }));
        let mailOptions = {
            from: from || process.env.EMAIL,
            to: to,
            subject: sub,
            template: 'index',
            context: {
                data: value,
            }
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}