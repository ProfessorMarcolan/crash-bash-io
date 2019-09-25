const socketIO = require('socket.io')
const ModelPlayer = require('./Player')
let rooms = require("../collections/default_rooms")

class Socket {
    constructor(http) {
        this.io = socketIO(http)
        this.testeArrayLobbyPlayes = []
        this.io.on('connection', socket => {
            console.log(`Socket ${socket.id} esta conectado!`)
            // lista de salas
            socket.emit("ROOMS_ON", rooms)
            
            // pegar todos os playes do lobby
            socket.emit("ALL_PLAYES_IN_LOBBY", this.testeArrayLobbyPlayes)
            
            // colocar este socket no lobby
            socket.on("ADD_PLAYER", player => this.JoinPlayerInRoom(socket, player, rooms[0].name))

            // remover socket do lobby ao desconectar
            socket.on('disconnect', () => {
                this.testeArrayLobbyPlayes.splice(socket.id, 1)
                console.log(`Socket ${socket.id} esta desconectado!`)
            })
        })
    }

    JoinPlayerInRoom(socket, player, room) {
        socket.nick = player.nick
        // colocar o socket no lobby
        socket.join(room)
        // criar um modelo de jogador
        let newPlayer = new ModelPlayer(player)
        // teste
        this.testeArrayLobbyPlayes[socket.id] = player
        // atualizar lista do lobby
        this.io.emit("ADD_JOIN_IN_ROOM", { room: rooms[0], player: newPlayer })
        // enviar prara o chat da sala que entrou um novo player
        socket.broadcast.to(room).emit("SEND_CHAT_LOBBY", { message: `Player ${newPlayer.nick} entrou na sala` })
    }

    RemovePlayerFromRoom(room) {

    }
}

module.exports = Socket