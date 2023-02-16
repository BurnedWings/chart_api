const { User, Friend, Grouping, ToUserMessage, Group, ToGroupMessage } = require("../model")
const createJwt = require('../util/createJwt')
const formidable = require('formidable')
const { avatarDir, videoDir } = require('../config/config.default')
const md5 = require('../util/md5')
const dayjs = require('dayjs')
//登录
exports.login = async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email }).select(['createdAt', 'updatedAt', 'birthday', 'gender', 'password', 'email', 'username', 'bio', 'image', 'phone'])

    if (user) {
        if (md5(req.body.password) === user.password) {
            const chat_token = await createJwt({ userId: user._id })
            user = user.toJSON()
            delete user.password
            res.status(200).json({
                code: 200,
                message: 'success',
                chat_token,
                user
            })
        } else {
            res.status(200).json({
                code: 201,
                message: '密码错误'
            })
        }
    } else {
        res.status(200).json({
            code: 202,
            message: '该邮箱未注册'
        })
    }


}

//注册
exports.register = async (req, res, next) => {

    const ret = await User.findOne({ email: req.body.email })

    if (ret) {
        return res.status(200).json({
            code: 201,
            message: '该邮箱已被占用',
        })
    }

    let user = await new User(req.body).save()

    user = user.toJSON()

    delete user.password

    new Grouping({
        ofUser: user._id,
        content: '默认分组'
    }).save()

    new Grouping({
        ofUser: user._id,
        content: '家人'
    }).save()

    new Grouping({
        ofUser: user._id,
        content: '好友'
    }).save()

    new Grouping({
        ofUser: user._id,
        content: '同学'
    }).save()

    res.status(200).json({
        code: 200,
        message: 'success',
        user
    })
}

//获取用户信息
exports.getUser = async (req, res, next) => {

    const user = req.user

    res.status(200).json({
        code: 200,
        message: 'success',
        user
    })
}

//搜索用户
exports.searchUser = async (req, res, next) => {
    try {
        const inputInfo = req.params.inputInfo
        const query = new RegExp(inputInfo, 'i')
        const users = await User.find({
            $or: [
                { username: { $regex: query } },
                // { description: { $regex: query } }
            ]
        })
        res.status(200).json({
            code: 200,
            message: 'success',
            users
        })
    } catch (error) {
        next(error)
    }
}

//获取某个用户信息
exports.getOneUser = async (req, res, next) => {
    try {
        const userId = req.params.userId

        const user = await User.findById(userId).select(['username', 'image', 'bio', 'gender'])

        res.status(200).json({
            code: 200,
            message: 'success',
            user
        })
    } catch (error) {
        next(error)
    }
}

//更新用户头像
exports.updateAvatar = async (req, res, next) => {
    try {

        const form = formidable({ multiples: true, uploadDir: avatarDir, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {

            if (err) {
                return next(err)
            }
            let url = 'avatars/' + files.files.newFilename
            const user = req.user
            user.image = url
            await user.save()
            res.status(200).json({
                code: 200,
                message: 'success'
            })
        });
    } catch (error) {
        console.log(error)
        next(error)
    }
}

//上传视频
exports.uploadVideo = async (req, res, next) => {
    try {

        const form = formidable({ multiples: true, uploadDir: videoDir, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return next(err)
            }
            // let url = 'avatars/' + files.files.newFilename
            // const user = req.user
            // user.image = url
            // await user.save()
            res.status(200).json({
                code: 200,
                message: 'success'
            })
        });

    } catch (error) {
        // console.log(error)
        next(error)
    }
}

//添加好友
exports.addUser = async (req, res, next) => {
    try {

        const { toUser, message, toGroup } = req.body
        const user = req.user._id

        new Friend({
            user,
            toUser,
            message,
            toGroup
        }).save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })

    } catch (error) {
        next(error)
    }
}

//获取好友申请
exports.getUserRequest = async (req, res, next) => {
    try {

        const userId = req.user._id

        const messageList = await Friend.find({
            toUser: userId
        }).populate(['user'])
            .sort({
                createdAt: 'desc'
            })

        res.status(200).json({
            code: 200,
            message: 'success',
            messageList
        })

    } catch (error) {
        next(error)
    }
}

//通过好友申请
exports.agreeUserRequest = async (req, res, next) => {
    try {

        const { messageId, groupId } = req.body.message

        const message = await Friend.findById(messageId)

        message.status = 2

        await message.save()

        const userId = req.user._id

        const messageList = await Friend.find({
            toUser: userId
        }).populate(['user'])

        const group = await Grouping.findById(groupId)

        group.userList.push(message.user)

        await group.save()

        const toGroup = await Grouping.findById(message.toGroup)

        toGroup.userList.push(userId)

        await toGroup.save()

        res.status(200).json({
            code: 200,
            message: 'success',
            messageList
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

//测试接口
// exports.addGroup = async (req, res, next) => {

//     const user = req.params.user

//     new Grouping({
//         ofUser: user,
//         content: '默认分组'
//     }).save()

//     new Grouping({
//         ofUser: user,
//         content: '家人'
//     }).save()

//     new Grouping({
//         ofUser: user,
//         content: '好友'
//     }).save()

//     new Grouping({
//         ofUser: user,
//         content: '同学'
//     }).save()
//     try {
//         res.status(200).json({
//             code: 200,
//             message: 'success'
//         })
//     } catch (error) {
//         next(error)
//     }
// }


//获取好友分组
exports.getUserGroup = async (req, res, next) => {
    try {

        const ofUser = req.user._id

        const groupList = await Grouping.find({
            ofUser
        }).select(['content', 'userList'])
            .populate(['userList'])

        // let friendArr = []

        // const friendList = await Friend.find({
        //     user:ofUser,
        //     status:2
        // }).populate(['toUser'])

        // friendList.forEach((item)=>{
        //     friendArr.push(item.toUser)
        // })

        // const myFriendList = await Friend.find({
        //     toUser:ofUser,
        //     status:2
        // }).populate(['user'])

        // myFriendList.forEach((item)=>{
        //     friendArr.push(item.user)
        // })

        res.status(200).json({
            code: 200,
            message: 'success',
            groupList,
            // friendArr
        })
    } catch (error) {
        next(error)
    }
}

//发送消息
exports.sendMessageToUser = async (req, res, next) => {
    try {

        const userId = req.user._id

        const { toUser, content } = req.body

        new ToUserMessage({
            user: userId,
            toUser,
            content
        }).save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

//获取消息
exports.getMessageList = async (req, res, next) => {
    try {

        const userId = req.user._id

        let myMessageArr = []

        const messageArr = await ToUserMessage.aggregate([
            {
                $match: {
                    isChecked: false,
                    toUser: userId
                },
            },
            {
                $group: {
                    _id: '$user',
                    count: {
                        $sum: 1
                    },
                }
            }
        ])

        for (const i in messageArr) {
            const messageList = await ToUserMessage.find({
                user: messageArr[i]._id,
                toUser: userId,
            }).populate(['user'])
                .sort({
                    createdAt: 'desc'
                })

            const myMessageList = await ToUserMessage.find({
                user: userId,
                toUser: messageArr[i]._id,
            }).populate(['user'])
                .sort({
                    createdAt: 'desc'
                })

            let newMessage = {}

            if (myMessageList.length === 0) {
                newMessage = messageList[0]
            } else {
                if (messageList[0].createdAt > myMessageList[0].createdAt) {
                    newMessage = messageList[0]
                } else {
                    newMessage = myMessageList[0]
                }
            }

            const count = await ToUserMessage.count({
                user: messageArr[i]._id,
                toUser: userId,
                isChecked: false
            })

            myMessageArr.unshift({
                id: messageList[0].user._id,
                username: messageList[0].user.username,
                image: messageList[0].user.image,
                message: newMessage.content,
                time: dayjs(newMessage.createdAt).format("YYYY/MM/DD HH:mm"),
                count
            })

        }

        let groupArr = []

        const groupList = await Group.find({
            userList: {
                $elemMatch: {
                    $eq: userId
                }
            }
        })

        if (groupList.length > 0) {
            for (const i in groupList) {
                const groupMessage = await ToGroupMessage.find({
                    user: {
                        $ne: userId
                    },
                    toGroup: groupList[i]._id,
                    checkedList: {
                        $nin: userId
                    }
                }).sort({
                    createdAt: 'desc'
                }).populate(['toGroup'])

                if (groupMessage.length > 0) {
                    groupArr.unshift({
                        id: groupMessage[0].toGroup._id,
                        username: groupMessage[0].toGroup.groupname,
                        image: groupMessage[0].toGroup.image,
                        message: groupMessage[0].content,
                        time: dayjs(groupMessage[0].createdAt).format("YYYY/MM/DD HH:mm"),
                        count: groupMessage.length
                    })
                }
            }
        }

        myMessageArr = [...myMessageArr, ...groupArr]

        myMessageArr.sort((preObj, nextObj) => {
            if (preObj.time < nextObj.time) return 1
            else if (preObj.time > nextObj.time) return -1
            else return 0
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            myMessageArr
        })
    } catch (error) {
        next(error)
    }
}


//获取单个用户消息列表
exports.getMessageListOfOneUser = async (req, res, next) => {
    try {

        const userId = req.user._id

        const { toUserId } = req.body

        const toUser = await User.findById(toUserId)

        let messageArr = []

        const messageList = await ToUserMessage.find({
            user: toUserId,
            toUser: userId
        }).populate(['toUser', 'user'])

        const myMessageList = await ToUserMessage.find({
            user: userId,
            toUser: toUserId
        }).populate(['user', 'toUser'])

        messageArr = [...messageList, ...myMessageList]

        messageArr.sort((preObj, nextObj) => {
            if (preObj.createdAt > nextObj.createdAt) return 1
            else if (preObj.createdAt < nextObj.createdAt) return -1
            else return 0
        })

        await ToUserMessage.updateMany({
            user: toUserId,
            toUser: userId,
            isChecked: false
        }, {
            $set: {
                isChecked: true
            }
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            toUser,
            messageArr
        })
    } catch (error) {
        next(error)
    }
}

//获取好友
exports.getFriendList = async (req, res, next) => {
    try {

        const ofUser = req.user._id

        let friendArr = []

        const friendList = await Friend.find({
            user: ofUser,
            status: 2
        }).populate(['toUser'])

        friendList.forEach((item) => {
            friendArr.push(item.toUser)
        })

        const myFriendList = await Friend.find({
            toUser: ofUser,
            status: 2
        }).populate(['user'])

        myFriendList.forEach((item) => {
            friendArr.push(item.user)
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            friendArr
        })
    } catch (error) {
        next(error)
    }
}


