const mongoose = require('mongoose');
const {dbUrl} = require('../config/config.default')
mongoose.set('strictQuery', true)
mongoose.connect(dbUrl)

var db = mongoose.connection

db.on('err',(err)=>{
    console.log('数据库连接失败',err)
})

db.once('open',()=>{
    console.log('数据库连接成功')
})

//组织导出模型类
module.exports = {
    User:mongoose.model('User',require('./user')),
    Friend:mongoose.model('Friend',require('./friend')),
    Grouping:mongoose.model('Grouping',require('./grouping')),
    ToUserMessage:mongoose.model('ToUserMessage',require('./toUserMessage')),
    Group:mongoose.model('Group',require('./group')),
    ToGroupMessage:mongoose.model('ToGroupMessage',require('./toGroupMessage')),
}
