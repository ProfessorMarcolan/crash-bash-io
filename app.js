const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static("./assets"));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
   });



io.on('connection', (socket) => {
    contr_player = new Cons_player(0)

    socket.player = contr_player.get_player()

    socket.on("mensagem", (msg)=>{
        console.log(msg)

        io.emit("mensagem", `O ${socket.id} enviou o mensagem: ${msg}`)
    })


    



    socket.on("move_direita", ()=>{

        socket.player.move_direita()

        io.emit("atualiza_jogo", socket.player);
        }
    )

    socket.on("move_esquerda", ()=>{

        socket.player.move_esquerda()

        io.emit("atualiza_jogo", socket.player);

    }
)

    console.log("oi mundo ta conectando o socket");





})


http.listen(3000, () => {
    console.log('listening on *:3000');
  });

class Cons_player{
    constructor(n_player){
        this.player = new Player()
        let movimento = new Movimento(true)

        this.player.set_movimento(movimento)


    }

    get_player(){
        return this.player;
    }
}



class Player{
    constructor(){
        this.vida = 0
        this.pos ={
            x : 10,
            y : 10
        }
        
    }

    //arrumar como especifica o player
    get_dados(){
        return {x:this.pos.x
               ,y:this.pos.y
               ,heigh:140
               ,width:150}
    }

    set_desenho(desenho){
        this.desenho =desenho;
    }

    
    set_movimento(movimento){
         this.movimento =movimento;
         this.movimento.set_data(this.pos)
    }

    move_direita(){
        this.movimento.move_direita();

    }
    move_esquerda(){
        this.movimento.move_esquerda();
    }


}

class Movimento{
    constructor(ch_horizontal){
        this.ch_horizontal = ch_horizontal;
        

    }
    set_data(pos){
        this.pos = pos
    }

    move_direita(){
        if(this.ch_horizontal){
            this.pos.x = this.pos.x + 20

        }else{
            this.pos.y = this.pos.y + 20
        }

        
    }
    move_esquerda(){
        if(this.ch_horizontal){
            this.pos.x = this.pos.x -20
        }else{

            this.pos.y = this.pos.y -20
        }

    }
}