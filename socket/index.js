const { User, ToGroupMessage } = require("../model");
const dayjs = require('dayjs')

module.exports = (io) => {

    const users = {}

    io.on("connection", (socket) => {

        socket.on('login', (id) => {
            users[id] = socket.id
            socket.name = id
        })

        socket.on('sendMessage', async (userId, toUserId, content) => {
            // socket.to(anotherSocketId).emit("private message", socket.id, msg);
            // console.log(socket.id)
            const user = await User.findById(userId)
            socket.to(users[toUserId]).emit('getMessageOfUser', {
                id: userId,
                image: user.image,
                message: content,
                time: dayjs(Date.now()).format("YYYY/MM/DD HH:mm"),
                username: user.username
            })
            socket.to(users[toUserId]).emit('getOneUserMessage', content)
        })

        //群聊
        socket.on("group", (groupId) => {
            socket.join(groupId)
        })

        socket.on("sendGroupMessage", (groupId, content, groupname, image, userId, userImage) => {
            socket.to(groupId).emit('getGroupMessage', groupId, content, dayjs(Date.now()).format("YYYY/MM/DD HH:mm"), groupname, image, userId, userImage)
        })

        socket.on("disconnect", (reason) => {
            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.name]
            }
        });
    });
}