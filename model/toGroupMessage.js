const mongoose = require('mongoose')
const baseModel = require('./base-model')
const Schema = mongoose.Schema

var toGroupMessageSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toGroup: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Group'
    },
    content: {
        type: String,
        required: true
    },
    checkedList:{
        type:[Schema.Types.ObjectId],
        default:[],
        ref: 'User'
    },
    ...baseModel
});

module.exports = toGroupMessageSchema