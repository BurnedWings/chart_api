const formidable = require('formidable')
const { groupDir } = require('../config/config.default');
const { Group, ToGroupMessage } = require('../model');

//群头像
exports.updateGroupAvatar = async (req, res, next) => {
    try {
        const form = formidable({ multiples: true, uploadDir: groupDir, keepExtensions: true });

        form.parse(req, async (err, fields, files) => {

            if (err) {
                return next(err)
            }
            let url = 'groupAvatars/' + files.files.newFilename

            res.status(200).json({
                code: 200,
                message: 'success',
                url
            })
        });
    } catch (error) {
        next(error)
    }
}

//建群
exports.createTheGroup = async (req, res, next) => {
    try {


        const userId = req.user._id

        const { groupname, image, userList } = req.body

        new Group({
            groupname,
            image,
            ownUser: userId,
            userList: [userId, ...userList]
        }).save()


        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        next(error)
    }
}

//获取已加入群聊
exports.getGroupWhichJoin = async (req, res, next) => {
    try {


        const userId = req.user._id

        const groupList = await Group.find({
            ownUser: {
                $ne: userId
            },
            userList: {
                $elemMatch: {
                    $eq: userId
                }
            }
        })

        const myGroup = await Group.find({
            ownUser: userId
        })


        res.status(200).json({
            code: 200,
            message: 'success',
            groupList,
            myGroup
        })
    } catch (error) {
        next(error)
    }
}

//获取群聊消息
exports.getGroupChatInfo = async (req, res, next) => {
    try {

        const userId = req.user._id

        const groupId = req.params.groupId

        const messageList = await ToGroupMessage.find({
            toGroup: groupId
        })
            .select(['content', 'user','checkedList'])
            .populate(['user'])

        for (const i in messageList) {
            if (JSON.stringify(messageList[i].user._id) !== JSON.stringify(userId)) {
                messageList[i].checkedList.push(userId)
                await messageList[i].save()
            }
        }

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

//发送群消息
exports.sendGroupMessage = async (req, res, next) => {
    try {

        const { groupId, content } = req.body

        const userId = req.user._id

        new ToGroupMessage({
            user: userId,
            toGroup: groupId,
            content,
            checkedList: [userId]
        }).save()

        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        next(error)
    }
}

