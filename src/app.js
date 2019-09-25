require('dotenv').config() // pegar variaveis de ambiente (.env)
const path = require("path") // opcional caso utilize o app para o html
const express = require("express")
const app = express()
const http = require('http').createServer(app)

//require Classes
const SocketClass = require("./Classes/Socket")
// connectar o socket ao server
const Socket = new SocketClass(http)

// socket on connection
Socket.io.on("connect", socket => {
    socket.emit("STATUS_SERVER", { status: true, text: "on" })
})

// apartir do "/" via get ele retorta o html
// Optional
// app.get("/", (req, res, next) => {
//     res.sendFile(path.join(__dirname + "/../views/index.html"))
// })

http.listen(process.env.PORT, () => {
    console.log(`Server ONLINE in: http://localhost:${process.env.PORT}`)
})
