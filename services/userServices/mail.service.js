const nodemailer = require('nodemailer')
const { mailSender, jwtSecret } = require('../../config/config')
const jwt = require('jsonwebtoken')
const USer = require('../../models/users')

let mailer = async (mailOptions) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailSender.username,
                pass: mailSender.password
            }
        });
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent Successfullly : ' + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    mailer
}

let demo = () => {
    // jwt.sign({ email: 'dipanshu' }, jwtSecret, (err, token) => {
    //     console.log(token);

    // })
    // USer.findOneAndUpdate({email: })
}
// demo()
