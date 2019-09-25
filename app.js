const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('./servidores');

app.use(express.static("./assets"));

//const {Sala, salas} = require("./classes/sala.js")


io.on('connection', (socket) => {
    

    socket.on("conecta_sala",(sala)=>{

        socket.join(sala)
        console.log(`O socket ${socket.id} se conectou na sal ${sala}`)


        socket.on("mensagem", ({room, mensagem}) =>{

            socket.to(room).emit("mensagem"),{
                mensagem,
                name:"oi"
            }

        })

 //       socket.to(sala).emit("oi",`${socket.id} oi mundo`)

    })

    

     socket.on('disconnect', function () {
       

        if (this.sala !=null){
       //     socket.sala.leave(socket.id)
        }
       

       
     });
    


    console.log("oi mundo ta conectando o socket");


})





app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
   });

const salas =["asdyuagsd123"]
//construir uma rota para pegar todos os jgoso ativos
app.get('/pega_salas', (req, res) => {
    let jogos_id = salas //salas.map((ele)=> {return ele.nome_sala})
    //refatorar o nome disso aqui
    res.json(salas);
   });





http.listen(3000, () => {
    console.log('listening on *:3000');
  });

