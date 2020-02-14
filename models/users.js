const mongoose = require('mongoose')

let userScheema = mongoose.Schema({
    userProfileId: {
        type: mongoose.Schema.Types.ObjectId
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailOtp: {
        type: String
    },
    forgotPassOtp: {
        type: String
    }
})

module.exports = mongoose.model('User', userScheema)