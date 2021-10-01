const nodemailer = require('nodemailer');

const sendMail = async options =>{
    //Create a transporter

    const transporter = nodemailer.createTransport({
        host:smtp.mailtrap.io,
        port: 25,
        auth:{
            user:bba2128941f31c,
            pass:f1f94fd28e40c2
        }
    })

    //Define mail option

    const mailOptions ={
        from: 'golamkibriashourav@gmail.com',
        to: options.mail,
        subject: options.subject,
        text: options.message
    };
    // Send the mail
    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;