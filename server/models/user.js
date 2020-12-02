var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String, 
        required: true, 
        validate: {
            validator: function (value) { return value && value.length >= 3 && value.length <= 30 },
            message: 'Username needs to be atleast 3 characters'
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) { return value && value.length >= 6 },
            message: 'Password needs to be atleast 6 characters'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

module.exports = mongoose.model("User", UserSchema);