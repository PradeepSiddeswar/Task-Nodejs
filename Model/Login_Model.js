const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
    
    UserName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: Number,
        required: true
    },
});

const LoginDB = mongoose.model("LoginDB", loginSchema);
module.exports = LoginDB