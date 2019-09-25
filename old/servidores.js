//socket.js

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static("./assets"));



module.exports = {
    async connect(http) {
        global.io = socket(http)
        
      	io.on('connect', async socket => {
            await socket.emit('EVENT', "ON")
        })        
    },
}