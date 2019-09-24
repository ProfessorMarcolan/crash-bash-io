const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static("./assets"));




class Sala{
    constructor(sala){
        this.nome_sala = sala 
        //os players tem o socket dentro deles
        //esta duplicado
        this.players = []
        this.sockets = []
        //talvez nos se arrependeremos dessa decição :D
        this.jogo = new Jogo(this, this.players)

        this.linha_direta = io.to(this.nome_sala)

        
        //this.estados = [jogando, pausado, iniciando]

    }

    //refatorar nem sei o que isso faz mais onome é ilegivel
    //tem mais de uma forma de usar a mesma coisa

    queu(){
    
         //   this.linha_direta.emit("queu", 
            //provavelmente tem que arrumar para ter estado
         //   this.players.map((ele)=>{return { id: ele.id, estado:false}}));
    
        
            this.linha_direta.emit("queu",
        {players_array_id: this.players.map((ele)=>{return { id: ele.id, ligado:true}})
        }
        );
    }


    remove_socket(socket){

        sockets.forEach(ele =>{
           ele == socket
        } ) 
        this.sockets = []

    }

    get_socket_by_id(id){
        let socket_encontrado = null
        this.sockets.forEach(ele=>{

            if(ele.id == id){
                socket_encontrado = ele 
            }

        })
        return socket_encontrado
    }

    set_socket_sala(socket){

        let regra_max_qtd_player= this.players.length < 3 

        if(regra_max_qtd_player){
            socket.sala = this

            socket.on("leave", (id) => this.leave(id))
            socket.on("ready", ()=> this.ready())
            

            //gambiarra vai dar problema no futuro
            //levar essa responsabilidade para a classe jogo

            //estamos construino  o player na sala ? Deveria ser construido no jogo
            //depois eu arrumao :D xD 
            let contr_player = new Cons_player(socket, this, this.jogo)
            this.players.push(contr_player.get_player())
            socket.on("comeca_jogo",()=> this.jogo.comeca_jogo() )
            socket.on("queu", ()=> this.queu)
            
            //socket.player = contr_player.get_player()


            socket.join(this.nome_sala);
            this.queu()


            //o id que vai sair vem do cliente.
            //nao parece ser algo bomm
            
            this.qnt_player = this.sockets.length
            this.sockets.push(socket)

        }else{
            this.starta_jogo()

        }
        
    }


    remove_player(socket){
        let pos_player = -1
        this.players.forEach((ele,id)=>{
            if (ele.socket == socket){
                pos_player = id
            }
        })

        this.players.splice(pos_player ,1)
    }

    //talvez pega o id da maquina
    leave(id){
        let socket = this.get_socket_by_id(id)
        socket.leave(this.nome_sala)
        
        this.remove_player(socket)

        this.linha_direta.emit("leave", {saiu_sala: true, socket_id : socket.id})

        this.queu();
    }

    //brasil_urgente


    ready(){

    }




    starta_jogo(){

        this.linha_direta.emit("queu",
        {players_array_id: this.players.map((ele)=>{return { id: ele.id, ligado:true}})
        }
        );

        

        this.timer_jogo = setInterval(()=> {this.jogo.loop()},1000)

    }

    stoppa_jogo(){
        clearInterval(this.timer_jogo)
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

        this.linha_direta = io.to(this.sala.nome_sala)
        
        //this.socket.on("comeca_jogo",()=> this.comeca_jogo() )
    }

    loop(){
        this.linha_direta.emit("game_loop", {players:[], jogo:true});


    }

    //inicio, fim ,pausa (nao se pausa jogo online HUASDHUADSHU)
    
    comeca_jogo(){

        this.linha_direta.emit("comeca_jogo", true);
        
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

        this.linha_direta.emit("atualiza_jogo", this.get_dados());
        
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
    let jogos_id = salas.map((ele)=> {return ele.nome_sala})
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
    

     socket.on('disconnect', function () {
       

        if (this.sala !=null){
            socket.sala.leave(socket.id)
        }
       

       
     });
    


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
        if(ele.nome_sala == sala )
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

        this.nome_player = ""
        this.regra_player_pronto = false


        this.linha_direta = io.to(this.sala.nome_sala)


        //estamos conectando o player com o evento do socket
        this.socket.on("move_direita",()=> this.move_direita() )
        this.socket.on("move_esquerda", ()=> this.move_esquerda())
        this.socket.on("set_nome", (nome)=> this.set_nome(nome))
        this.socket.on("ready", ()=> this.ready())

        
    }
    set_nome(nome){

        this.nome_player = nome
        //this.jogo.regras_jogo()

    }

    ready(){

        this.regra_player_pronto = !this.regra_player_pronto

        this.linha_direta.emit("ready", true);
        //this.jogo.regras_jogo()

    }








    //arrumar com as informações especificas do player
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