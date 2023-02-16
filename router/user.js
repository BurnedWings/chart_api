const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/user')
const auth = require('../middleware/auth')

router.post('/login',userCtrl.login)

router.post('/register',userCtrl.register)

router.get('/getUser',auth,userCtrl.getUser)

router.get('/searchUser/:inputInfo',auth,userCtrl.searchUser)

router.get('/getOneUser/:userId',auth,userCtrl.getOneUser)

router.post('/updateAvatar',auth,userCtrl.updateAvatar)

router.post('/uploadVideo',userCtrl.uploadVideo)

router.post('/addUser',auth, userCtrl.addUser)

router.get('/getUserRequest',auth, userCtrl.getUserRequest)

router.post('/agreeUserRequest',auth, userCtrl.agreeUserRequest)

//测试接口
// router.get('/addGroup/:user',auth, userCtrl.addGroup)

router.get('/getUserGroup',auth, userCtrl.getUserGroup)

router.post('/sendMessageToUser',auth, userCtrl.sendMessageToUser)

router.get('/getMessageList',auth, userCtrl.getMessageList)

router.post('/getMessageListOfOneUser',auth, userCtrl.getMessageListOfOneUser)

router.get('/getFriendList',auth, userCtrl.getFriendList)



module.exports = router