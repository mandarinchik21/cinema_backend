const nodemailer = require('nodemailer');

require('dotenv').config({ path: '.env' });

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
    }
});

exports.sendReservePasswordEmail = async options => {
    const mailOptions = {
        from: 'Star Cinema',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transport.sendMail(mailOptions)
};

exports.sendTicketEmail = async options => {
    const mailOptions = {
        from: 'Cinema',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transport.sendMail(mailOptions);
};