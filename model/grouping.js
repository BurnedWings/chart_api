const mongoose = require('mongoose')
const baseModel = require('./base-model')
const Schema = mongoose.Schema

var groupingSchema = mongoose.Schema({
    ofUser: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    userList:{
        type:[Schema.Types.ObjectId],
        default:[],
        ref: 'User'
    },
    ...baseModel
});

module.exports = groupingSchema