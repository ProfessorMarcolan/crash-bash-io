const socket = io('http://localhost:3000')

socket.on('STATUS_SERVER', statusServer => {
    // verificar se o server esta online
    if(statusServer.status) {
        // mudar cor do status do server no NavBar
        $("#STATUS_SERVER_TEXT, #STATUS_SERVER_DOT")
        .removeClass("text-danger")
        .addClass("text-success")
        
        // mudar texto do status do server no NavBar
        $("#STATUS_SERVER_TEXT").html(statusServer.text)
    }
})

socket.on("ALL_PLAYES_IN_LOBBY", allInLobby => {
    allInLobby.forEach((player, indexPlayer) => {
        AddPlayerInLobby(player)
    })
})

socket.on("ADD_JOIN_IN_ROOM", ({room, player}) => {
    if(room.id == 1) {
        // adicionar player no lobby
        AddPlayerInLobby(player)
    }
})

socket.on("ROOMS_ON", rooms => {
    rooms.forEach((room, indexRoom) => {
        if(indexRoom != 0) {
            // adcionar salas na lista
            AddSalaInList(room)
        }
    })
})

socket.on("SEND_CHAT_LOBBY", data => {
    AddMessageInChat("CHAT_LOBBY", data.message)
})

// submitar form com dados do usuario
$("#form-player").submit((event) => {
    let nickComponet = $("#USER_NICK")
    let senhaComponet = $("#USER_PSWD")
    let player = {}
    // Pegar valores do input
    player.nick = nickComponet.val()
    player.senha = senhaComponet.val()
    // Enviar valores para o socket
    socket.emit("ADD_PLAYER", player)
    // Limpar inputs
    nickComponet.val("")
    senhaComponet.val("")
    $("#form-player").addClass("d-none")
    return false
})

function AddPlayerInLobby(player) {
    $("#LOBBY").append(`
        <div id="${player.nick}" class="row bg-white rounded m-1">
            <div class="col">
                ${player.nick}
            </div>
            <div class="col">
                Status 
            </div>
            <div class="col">
                Point 
            </div>
        </div>
    `)
}

function AddSalaInList(sala) {
    $("#SALAS").append(`
        <div id="room-${ sala.id }" class="row m-1 align-items-center rounded bg-white">
            <div class="col-5">
                <h3>${ sala.name } <span class="">(${ sala.type })</span></h3>
            </div>
            <div class="col">

            </div>
        </div>
    `)
}

function AddMessageInChat(chat, message) {
    $(`#${chat}`).append(`
        <span>${message}</span>
    `)
}