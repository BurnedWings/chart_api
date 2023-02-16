const mongoose = require('mongoose')
const baseModel = require('./base-model')
const Schema = mongoose.Schema

var toUserMessageSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUser: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    ...baseModel
});

module.exports = toUserMessageSchema