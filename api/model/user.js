var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    User = new Schema({
        userName: {
            type: String,
            unique: true,
            required: true
        },
        firstName: {
            type: String,
            unique: false,
            required: true
        },
        lastName: {
            type: String,
            unique: false,
            required: true
        },
        pid: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            unique: false,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        }
    });

User.path('userName').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

module.exports = mongoose.model('User', User);