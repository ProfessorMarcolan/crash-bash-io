const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static("./assets"));



class Sala{
    constructor(sala){
        this.sala = sala 
        this.players = []
        //talvez nos se arrependeremos dessa decição :D
        this.jogo = new Jogo(this.sala, this.players)

    }

    set_player(socket){

        this.players.push(socket)

        let contr_player = new Cons_player(socket,this.sala)
        socket.player = contr_player.get_player()

        socket.join(this.sala);
        //io.to(this.sala).emit('comeca', "conectado");

        

        socket.on("queu", ()=>{
    
    
            io.to(this.sala).emit("queu", 
            this.players.map((ele)=>{return ele.id}));
    
        })




        this.qnt_player = this.players.length


    }
}





class Jogo{
    constructor(sala,players){
        this.sala = sala 
        this.players = []
        this.players = players
    }





}

const salas = [new Sala(gera_nomes_aleatorios())]

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
   });

//construir uma rota para pegar todos os jgoso ativos
app.get('/pega_salas', (req, res) => {
    let jogos_id = salas.map((ele)=> {return ele.sala})
    //refatorar o nome disso aqui
    res.json({ jogos: jogos_id });
   });

app.get("conecta_room",(req, res)=>{

    res.json({ sala: '1' })
})




io.on('connection', (socket) => {
    

    socket.on("mensagem", (msg)=>{
        console.log(msg)

        io.emit("mensagem", `O ${socket.id} enviou o mensagem: ${msg}`)
    })

 
    socket.on("conecta_sala",(sala)=>{
        conecta_sala(sala, socket)
        
    })


    console.log("oi mundo ta conectando o socket");


})


 

function gera_nomes_aleatorios(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

//precisa remover of ato de coenctar com o de criar novas salas

function conecta_sala(sala,socket){

    sala_enc = get_sala_by_id(sala)

    sala_enc.set_player(socket)


}


function get_sala_by_id(sala){
    let sala_jogo_encontrada = null 
    salas.forEach(ele =>{
        if(ele.sala == sala )
        sala_jogo_encontrada = ele

    })

    return sala_jogo_encontrada;
}


//funcao depreceada temq ue arruma para apenas crear jogos
function create_jogo(sala,socket){

    jogos.forEach(ele =>{
        let regra_sala_Existe = ele.sala === sala
        if(regra_sala_Existe ){
            let regra_Sala_cheia = ele.qnt_player === 4
            if(regra_Sala_cheia){

                let jogo =new Jogo(gera_nomes_aleatorios())
                jogo.set_player(socket)
                jogos.append(jogo)
            }else{
                ele.set_player(socket)
            }
        

        }else{
            let jogo =new Jogo(gera_nomes_aleatorios())
            jogo.set_player(socket)
            jogos.append( jogo)
        }
        

    })




}





http.listen(3000, () => {
    console.log('listening on *:3000');
  });

class Cons_player{
    constructor(socket, sala){
        this.player = new Player(socket,sala)
        let movimento = new Movimento(true)

        this.player.set_movimento(movimento)


    }

    get_player(){
        return this.player;
    }
}



class Player{
    constructor(socket_player,sala){
        this.sala = sala 
        this.vida = 0
        this.pos ={
            x : 10,
            y : 10
        }

        this.id = socket_player.id
        this.socket = socket_player



        //estamos conectando o player com o evento do socket
        this.socket.on("move_direita",()=> this.move_direita() )
        this.socket.on("move_esquerda", ()=> this.move_esquerda())

        
    }

    //arrumar como especifica o player
    //defasado nems ei se funciona mais HUShudsauhhuSADHUASDHUhuds
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

        //arrumar o que envia
        io.to(this.sala).emit("atualiza_jogo", this.get_dados());

    }
    move_esquerda(){
        this.movimento.move_esquerda();

        //arrumar o que envia
        io.to(this.sala).emit("atualiza_jogo", this.get_dados());
    }

    atira_poder(){

    }


}

class Movimento{
    constructor(ch_horizontal){
        this.ch_horizontal = ch_horizontal;
        

    }
    set_data(pos){
        this.pos = pos
    }

    //conferir se a logica esta fucnionando
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