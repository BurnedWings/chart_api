const mongoose = require('mongoose')
const md5 = require('../util/md5')
const baseModel = require('./base-model')


var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        set: value => md5(value),
        select: false
    },
    bio: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: 'avatars/06c794d1bbdd850f.jpg'
    },
    birthday: {
        type: Date,
        default: null
    },
    gender: {
        type: Number,
        default: 3
    },
    phone: {
        type: String,
        default: null
    },
    // trendsCount: {
    //     type: Number,
    //     default: 0
    // },
    ...baseModel
});

module.exports = userSchema