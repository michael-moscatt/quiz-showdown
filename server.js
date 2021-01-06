// Express
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Socket
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var rooms = {} // roomName -> room
const ROOM_LIMIT = 4;

http.listen(port, function() {
    console.log('Server running. Port: ' + port);
});

io.on('connection', function (socket) {
    var user = new User(socket);
    var room = {};

    socket.on('disconnect', function() {
        console.log("socket dc");
        if('users' in room){
            leaveRoom(user, room);
        }
    });

    socket.on('host', function(username) {
        username = username.substring(0, 16);
        var roomName = randomLetters(1); // CHANGE TO 6
        socket.emit('host-response', "ok");
        rooms[roomName] = new Room(user, roomName);
        room = rooms[roomName];
        user.name = username;
        socket.join(roomName);
        console.log("Room %s: Hosted by '%s'", roomName, username);
    });

    // Check if user is able to join the room, if so then add them
    socket.on('join', function(joinObj) {
        var response;
        var roomName = joinObj.roomName;
        var username = joinObj.username.substring(0, 16);
        room = rooms[roomName];
        if(!(roomName in rooms)){
            response = "invalid";
        } else if(!room['state'] == 'lobby'){
            response = "ingame";
        } else if(room['users'].length >= ROOM_LIMIT - 1){
            response = "full";
        } else if(room['users'].map(OneUser => OneUser.name).includes(username)
            || username === room['host'].name){
            response = "name taken";
        } else {
            user.name = username;
            response = "ok";
            joinRoom(user, roomName, room);
            console.log("Room %s: '%s' joined", roomName, username);
        }
        socket.emit('join-response', response);
    });

    socket.on('request-usernames', () => {
        if('users' in room){
            broadcastUsernames(room);
        }
    });

    socket.on('request-room-name', () => {
        if('name' in room){
            socket.emit('room-name', room.name);
        }
    });

    socket.on('request-is-host', () => {
        if('host' in room){
            var isHost = room.host === user;
            socket.emit('is-host-response', isHost);
        }
    });

    socket.on('start-game', (request) => {
        if('host' in room && room.host == user && room.state === 'lobby'){
            room.settings.interrupt = request.interrupt;
            startGame(room);
        }
    });
});

function User(socket){
    this.socket = socket;
    this.name = "";
}

function Room(user, roomName){
    this.users = [];
    this.host = user;
    this.name = roomName;
    this.state = 'lobby';
}

// Informs all players in the room that the user has joined
function joinRoom(user, roomName, room){
    room = rooms[roomName];
    room['users'].push(user);
    user['socket'].join(roomName);
    broadcastUsernames(room);
}

// Removes user from room, inform other players if there are any, closes room if not
function leaveRoom(user, room){
    var userWasHost = false;
    if(user.name == room.host.name){ // TODO: handle host leaving room
        room.host == {name: "left"};
        userWasHost = true;
    } else {
        room['users'] = room['users'].filter(function (oneUser) {
            return oneUser !== user;
        });
    }
    user['socket'].leave(room.name);
    if(room['users'].length < 1 && userWasHost){
        delete rooms[room.name];
    } else {
        broadcastUsernames(room);
    }
}

// Broadcasts usernames for given room
function broadcastUsernames(room){
    io.to(room.name).emit('usernames', 
    {
        users: room['users'].map(user => user.name),
        hostName: room.host.name
    });
    console.log("broadcasted names");
}

// Starts the game for the given room
function startGame(room){

}

// Makes a new player the host
function newHost(){
    // broadcast usernames
    // broadcast is-Host-Response
}

// Returns n random, capital letters as a string
function randomLetters(n){
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var letters = [];
    
    for(i=0;i<n;i++){
        letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    return letters.join("");
}