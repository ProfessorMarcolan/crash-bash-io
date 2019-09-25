const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

class Jogo{
    constructor(sala,players){
        this.sala = sala 
        this.players = players

        this.linha_direta = io.in(this.sala.nome_sala)
        
        //this.socket.on("comeca_jogo",()=> this.comeca_jogo() )
    }

    loop(){
        this.linha_direta.emit("game_loop", {players:[], jogo:true});


    }

    //inicio, fim ,pausa (nao se pausa jogo online HUASDHUADSHU)
    
    comeca_jogo(room){

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

module.exports = Jogo