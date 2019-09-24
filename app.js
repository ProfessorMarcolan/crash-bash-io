const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static("./assets"));




class Sala{
    constructor(sala){
        this.sala = sala 
        //os players tem o socket dentro deles
        this.players = []
        this.sockets = []
        //talvez nos se arrependeremos dessa decição :D
        this.jogo = new Jogo(this.sala, this.players)

        


        

        //this.estados = [jogando, pausado, iniciando]

    }

    queu(){
    
            io.to(this.sala).emit("queu", 
            //provavelmente tem que arrumar para ter estado
            this.players.map((ele)=>{return { id: ele.id, estado:false}}));
    
        
    }


    set_socket_sala(socket){

        let regra_max_qtd_player= this.players.length < 3 

        if(regra_max_qtd_player){
            this.sockets.push(socket)

            //gambiarra vai dar problema no futuro
            //levar essa responsabilidade para a classe jogo
            let contr_player = new Cons_player(socket, this.sala, this.jogo)
            this.players.push(contr_player.get_player())
            socket.on("comeca_jogo",()=> this.jogo.comeca_jogo() )
            socket.on("queu", ()=> this.queu)
            //socket.player = contr_player.get_player()


            socket.join(this.sala);
            this.queu()
            this.qnt_player = this.sockets.length

        }else{
            this.starta_jogo()

        }
        
    }

    starta_jogo(){

        io.to(this.sala).emit("queu", 
        //provavelmente tem que arrumar para ter estado
        this.players.map((ele)=>{return { id: ele.id, ligado:true}}));

        this.jogo.comeca_jogo()

    }



    //precisa ser refatorado
    //seta conexão
    set_player(socket){

        this.players.push(socket)
        socket.join(this.sala);
        this.queu()

        this.qnt_player = this.players.length


    }


}

class Cons_player{
    constructor(socket, sala, jogo){
        this.sala = sala
        this.player = new Player(socket,sala, jogo)
        let movimento = new Movimento(true)

        this.player.set_movimento(movimento)

    }


    get_player(){
        return this.player;
    }
}



class Jogo{
    constructor(sala,players){
        this.sala = sala 
        this.players = players

        
        
        //this.socket.on("comeca_jogo",()=> this.comeca_jogo() )
    }

    //inicio, fim ,pausa (nao se pausa jogo online HUASDHUADSHU)
    
    comeca_jogo(){

        io.to(this.sala).emit("comeca_jogo", true);
        
    }

    //toda vez que o player se mover
    regras_jogo(){
        //player morreu
        //player levo um gol
        //posicao da bola 

        this.envia_estado_jogo()
    }

    get_dados(){
        let player_pos = this.players.map((ele)=> {return ele.get_dados()})

        return [{players:player_pos, estado:true}]

    }

    envia_estado_jogo(){

        io.to(this.sala).emit("atualiza_jogo", this.get_dados());
        
    }

}
function gera_nomes_aleatorios(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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




//estart poitn do nosso projeto

io.on('connection', (socket) => {
    

    socket.on("mensagem", (msg)=>{
        console.log(msg)

        io.emit("mensagem", `O ${socket.id} enviou o mensagem: ${msg}`)
    })

 
    //refatorar
    socket.on("conecta_sala",(sala)=>{
        conecta_sala(sala, socket)
        
    })
    
    


    console.log("oi mundo ta conectando o socket");


})

//isso precisa ser refatorado
function conecta_sala(sala,socket){

    sala_enc = get_sala_by_id(sala)

    sala_enc.set_socket_sala(socket)


}


function get_sala_by_id(sala){
    let sala_jogo_encontrada = null 
    salas.forEach(ele =>{
        if(ele.sala == sala )
        sala_jogo_encontrada = ele

    })

    return sala_jogo_encontrada;
}



 


//precisa remover of ato de coenctar com o de criar novas salas



/*
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
*/




http.listen(3000, () => {
    console.log('listening on *:3000');
  });





class Player{
    constructor(socket_player,sala, jogo){
        this.jogo = jogo
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
        this.jogo.regras_jogo()

        //arrumar o que envia
       

    }
    move_esquerda(){
        this.movimento.move_esquerda();
        this.jogo.regras_jogo()


        
    }

    atira_poder(){
        this.jogo.regras_jogo()

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