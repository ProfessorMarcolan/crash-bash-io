var socket = io();

socket.emit("connect");


socket.on("mensagem", (msg)=> console.log(msg))

socket.on("atualiza_jogo", (msg)=> console.log(msg))

function envia_msg(msg){
    socket.emit("mensagem",msg);
}

function mov_direita(msg){
    socket.emit("move_direita");
}
function mov_esquerda(msg){
    socket.emit("move_esquerda");
}