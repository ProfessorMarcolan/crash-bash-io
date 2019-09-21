const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static("./assets"));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
   });


io.on('connection', (socket) => {
    console.log("oi mundo ta conectando o socket");
})


http.listen(3000, () => {
    console.log('listening on *:3000');
  });