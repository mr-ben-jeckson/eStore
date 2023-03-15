const express = require('express');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const pathView = path.resolve(__dirname, '../utils/mail/templates/view');
const partialsView = path.resolve(__dirname, '../utils/mail/templates/partials');
module.exports = {
    sendMail: (payload) => {
        let transporter = nodemailer.createTransport({
            host: `${process.env.SMTP_HOST}`,
            port: `${process.env.SMTP_PORT}`,
            auth: {
                user: `${process.env.SMTP_USER}`,
                pass: `${process.env.SMTP_PASSWORD}`
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
            from: `${process.env.EMAIL}`,
            to: payload.to,
            subject: payload.sub,
            template: 'index',
            context: {
                data: payload.data,
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