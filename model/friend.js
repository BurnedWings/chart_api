const mongoose = require('mongoose')
const baseModel = require('./base-model')
const Schema = mongoose.Schema

var friendSchema = mongoose.Schema({
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
    toGroup:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Grouping'
    },
    message: {
        type: String,
        required: true
    },
    status:{
        type:Number,
        default:1
    },
    ...baseModel
});

module.exports = friendSchema