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
    let buto_saida = $(`<button>Saia dessa SALA</button>`)


    let envia = () =>{
        console.log(ele)
        socket.emit("conecta_sala",ele);

        socket.emit("queu");
        
    
    }

    let envia_saida = ()=>{
        socket.emit("leave", socket.id)
    }

    buto.on("click",() => envia())
    buto_saida.on("click",() => envia_saida())

    $('#sala').append(buto);

    $('#sala').append(buto_saida);
    })
    
});



socket.on("leave", (msg)=>{

    if (msg.saiu_sala && socket.id === msg.socket_id){
        let div = $("#player_jogo")
        div[0].innerText =""

        alert("SAIU DA SALA MANO")


    }else{

        alert("Alguem saiu da sala")
    }

})





//socket.emit("comeca_jogo");



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


socket.on("comeca_jogo", (msg)=>{
    console.log(msg)

})

function atualizando_player_sala(msg){
    let div = $("#player_jogo");
    div[0].innerText = ""

    msg.forEach(ele=>{
        let p = $(`<p>${ele.id} </p>`)
        let buto = $(`<button>Ready</button>`)
        let envia = () =>{
            console.log(ele)
            socket.emit("ready");
            
        
        }
        buto.on("click",() => envia())



        div.append(p)
        div.append(buto)
    })
}
socket.on("queu", (msg)=>{
    
    atualizando_player_sala(msg.players_array_id)

})


socket.on("game_loop", (msg)=> {
    console.log(msg)
    })

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


