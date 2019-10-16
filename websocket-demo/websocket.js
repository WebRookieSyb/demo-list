// websocket.js
let express = require('express')
let app = express()
app.use(express.static(__dirname))
//http服务器
app.listen(8000)

let WebSocketServer = require('ws').Server;
//启动ws服务器，监听9999端口
let wsServer = new WebSocketServer({port: 9999});

//监听客户端连接
wsServer.on('connection', function(socket) {
    console.log(socket)
    console.log('服务端连接成功')
    //监听消息
    socket.on('message', function(message){
        console.log('客户端接受消息', message);
        socket.send('返回消息');
    })
})