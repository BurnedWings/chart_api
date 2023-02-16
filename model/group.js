const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')


var userSchema = mongoose.Schema({
    groupname: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'groupAvatars/06c794d1bbdd850f.jpg'
    },
    ownUser: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userList: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    ...baseModel
});

module.exports = userSchema