const User = require('../../models/users')
const bcrypt = require('bcrypt')
const { mailer } = require('../../services/userServices/mail.service')
const { mailSender } = require('../../config/config')
const common = require('../../services/common.services')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/config')



// user signup
let signUp = async (req, res) => {
    let { email, password } = req.body
    email = email.toLowerCase()
    try {
        User.findOne({ email: email }, async (err, response) => {
            if (response != null || response != undefined) {
                res.status(200).json({
                    success: false,
                    msg: "This email already exists please provide another email address!",
                    type: "email exists"
                });
            } else {
                let salt = await bcrypt.genSaltSync(10);
                let otp = common.generateOtp(6, '1q2w3e4r5t6y7u8i9os8d96gz68n')
                bcrypt.hash(password, salt)
                    .then(hash => {
                        let user = new User({
                            email: email,
                            password: hash,
                            emailOtp: otp,
                            forgotPassOtp: ''
                        })
                        user.save()
                            .then(result => {
                                let emailHTML = `<h4> One Time Password </h4>: <h2>${otp}</h2>`
                                mailOptions = {
                                    from: mailSender.username, // sender address
                                    to: email, // receivers address
                                    subject: 'Email Verification', // Subject line
                                    html: emailHTML // html body
                                };
                                mailer(mailOptions)
                                res.status(200).json({
                                    msg: result
                                })
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    })
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// user login
let login = async (req, res) => {
    let { email, password } = req.body
    email = email.toLowerCase()
    try {
        User.findOne({ email: email }, (err, response) => {
            if (err || response == null || response == undefined) {
                res.status(200).json({
                    success: false,
                    msg: "Email dosen't exist",
                    type: "invalid email"
                });
            } else {
                bcrypt.compare(password, response.password)
                    .then((result) => {
                        if (result) {
                            jwt.sign({ email: response.email }, jwtSecret, (err, token) => {
                                res.status(200).json({
                                    success: true,
                                    msg: "Login Successfully",
                                    type: 'login',
                                    token: token
                                })
                            })
                        } else {
                            res.status(200).json({
                                success: false,
                                msg: "Please check your email or password",
                                type: "invalid email or password"
                            });
                        }

                    });
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// email verification
let emailVerification = async (req, res) => {
    let { email, otp } = req.body
    User.findOne({ email: email, emailOtp: otp }, async (err, response) => {
        if (err || response == null || response == undefined) {
            res.status(200).json({
                success: false,
                msg: "Invalid OTP",
                type: "Invalid OTP"
            })
        } else {
            await User.findOneAndUpdate({ email: response.email }, { isEmailVerified: true })
            res.status(200).json({
                success: true,
                msg: "Email Verification Successfully",
                type: "Email Verification "
            })
        }
    })
}

// forgot password
let forgotPassword = async (req, res) => {
    try {
        let { email } = req.body
        email = email.toLowerCase()
        User.findOne({ email: email }, async (err, response) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: err,
                    type: 'forgot password'
                });
            }
            if (response == null || response == undefined) {
                res.json({
                    success: false,
                    msg: 'User not found',
                    type: 'Forgot Password'
                });
            } else {
                let otp = common.generateOtp(6, '1q2w3e4r5t6y7u8i9os8d96gz68n')
                let emailHTML = `<h4> One Time Password </h4>: <h2>${otp}</h2>`
                await User.findOneAndUpdate({ email: email }, { forgotPassOtp: otp })
                mailOptions = {
                    from: mailSender.username, // sender address
                    to: email, // receivers address
                    subject: 'Fogot Password', // Subject line
                    html: emailHTML // html body
                };
                mailer(mailOptions)
                res.status(200).json({
                    success: true,
                    msg: "Please check your email for forgot password process!",
                    type: "forget password"
                });
            }
        })
    } catch (error) {
        console.log(error);
    }

}

// reset password
let resetPassword = async (req, res) => {
    let { email, password, otp } = req.body
    User.findOne({ email: email, forgotPassOtp: otp }, async (err, response) => {
        if (err) {
            res.status(500).json({
                success: false,
                msg: err,
                type: 'Reset Password'
            })
        } else {
            let salt = await bcrypt.genSaltSync(10);
            bcrypt.hash(password, salt)
                .then(async (hash) => {
                    await User.findOneAndUpdate({ email: response.email }, { password: hash })
                    res.status(200).json({
                        success: true,
                        msg: 'Password Updated Successfully',
                        type: 'Update Password'
                    })
                })
        }
    })
}
module.exports = {
    signUp: signUp,
    login: login,
    emailVerification: emailVerification,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword
}