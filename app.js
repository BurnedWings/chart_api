const express = require('express')
const morgan = require('morgan')
const path = require('path')
const router = require('./router/index')
const errorHandler = require('./middleware/errorHandler')
require('./model')
const app = express()
const port = 3000

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */
    cors: true
});

require('./socket/index')(io)


httpServer.listen(4000);



app.use('/avatars', express.static(path.join(__dirname, './public/avatars/')))

app.use('/groupAvatars', express.static(path.join(__dirname, './public/groupAvatars/')))

//配置req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))



app.use(router)

app.use(errorHandler())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))