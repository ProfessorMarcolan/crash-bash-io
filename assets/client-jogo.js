var socket = io();

socket.emit("connect");


//estou plorando coisas queu nao deveria estar explorando
//HUADSHUASDHUASDHUAHUSDhuASD
//mas isso nao é uma live didatica SHAUDHUASDHUADSHUAHUDShuads
//refatore essa gambiarra XD
$.getJSON('/pega_salas', 
function (data, textStatus, jqXHR){
    this.data = data 
    data.jogos.forEach(ele => {
    let buto = $(`<button>${ele}</button>`)
    let envia = () =>{
        console.log(ele)
        socket.emit("conecta_sala",ele);
    
    }
    buto.on("click",() => envia())

    $('#sala').append(buto);
    })
    
});














class Game{

    constructor(){

        this.conj_ids = new Set()
    
        this.get_dados =(id)=>{
            
            this.conj_ids.add(id)
            this.mostra_id()
        }

        socket.on("set_ids", this.get_dados)
        socket.emit("get_ids");

    }

    mostra_id(){

        this.conj_ids.forEach(ele => console.log(ele))

    }

    get_player_by_id(id){
        player = null;
        jogadores.forEach(ele =>{
          if (ele.id == id) {
            player = ele;
          }
        })
        return player;
      }

}

const game = new Game()


socket.on("mensagem", (msg)=> console.log(msg))


socket.on("atualiza_jogo", (msg)=> {
    console.log(msg)
    })

function envia_msg(msg){
    socket.emit("mensagem",msg);
}

function mov_direita(msg){
    socket.emit("move_direita");
}
function mov_esquerda(msg){
    socket.emit("move_esquerda");
}


