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


        this.linha_direta = this.socket.to(this.sala.nome_sala)


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

module.exports = {Cons_player ,Player }