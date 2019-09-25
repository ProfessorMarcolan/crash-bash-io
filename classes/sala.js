const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
//"PÁRE DE USAR SOCKET.IO ERRADO!"
//Como não perder a cabeça com socket.io"
const Jogo = require("./jogo")
const {Cons_player ,Player } =  require("./user")







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








class Sala{
    constructor(sala){
        this.nome_sala = sala 
        //os players tem o socket dentro deles
        //esta duplicado
        this.players = new Set()
        this.sockets = new Set()
        //talvez nos se arrependeremos dessa decição :D
        this.jogo = new Jogo(this, this.players)

        this.linha_direta = io.in(this.nome_sala)

        
        //this.estados = [jogando, pausado, iniciando]

    }

    //refatorar nem sei o que isso faz mais onome é ilegivel
    //tem mais de uma forma de usar a mesma coisa

    queu(){
    
         //   this.linha_direta.emit("queu", 
            //provavelmente tem que arrumar para ter estado
         //   this.players.map((ele)=>{return { id: ele.id, estado:false}}));
    
        let list_player = [... this.players.values()]
        this.linha_direta.emit("queu",
        {players_array_id: list_player.map((ele)=>{return { id: ele.id, ligado:true}})
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

        let regra_max_qtd_player= [...this.players.values()].length < 3 

        if(regra_max_qtd_player && !this.sockets.has(socket)){
            socket.sala = this
            socket.join(this.nome_sala);

            socket.on("leave", (id) => this.leave(id))
            socket.on("ready", ()=> this.ready())
            

            //gambiarra vai dar problema no futuro
            //levar essa responsabilidade para a classe jogo

            //estamos construino  o player na sala ? Deveria ser construido no jogo
            //depois eu arrumao :D xD 
            let contr_player = new Cons_player(socket, this, this.jogo)
            this.players.add(contr_player.get_player())
            socket.on("comeca_jogo",(room,mensagem)=> this.jogo.comeca_jogo(room) )
            socket.on("queu", ()=> this.queu)
            
            //socket.player = contr_player.get_player()


            
            this.queu()


            //o id que vai sair vem do cliente.
            //nao parece ser algo bomm
            
            this.qnt_player = this.sockets.length
            this.sockets.add(socket)

        }else{
            this.starta_jogo()

        }
        
    }


    remove_player(socket){
        let pos_player = -1
        let player = null
        let lis_vet = [...this.players.values()]
        lis_vet.forEach((ele,id)=>{
            if (ele.socket == socket){
                pos_player = id
                player = ele
            }
        })

        this.players.delete(player)
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


        let lis_player = [...this.players.values()]
        this.linha_direta.emit("queu",
        {players_array_id: lis_player.map((ele)=>{return { id: ele.id, ligado:true}})
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

function gera_nomes_aleatorios(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}




const salas = [new Sala(gera_nomes_aleatorios()), new Sala(gera_nomes_aleatorios())]
module.exports = {Sala, salas}