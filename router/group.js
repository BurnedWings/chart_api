const express = require('express')
const router = express.Router()
const groupCtrl = require('../controller/group')
const auth = require('../middleware/auth')

router.post('/updateGroupAvatar',auth,groupCtrl.updateGroupAvatar)

router.post('/createTheGroup',auth,groupCtrl.createTheGroup)

router.get('/getGroupWhichJoin',auth,groupCtrl.getGroupWhichJoin)

router.get('/getGroupChatInfo/:groupId',auth,groupCtrl.getGroupChatInfo)

router.post('/sendGroupMessage',auth,groupCtrl.sendGroupMessage)


module.exports = router