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
    var room;

    socket.on('disconnect', function() {
        console.log("Disconnection");
    });

    socket.on('host', function(username) {
        var roomName = randomLetters(6);
        socket.emit('host-response', roomName);
        rooms[roomName] = new Room(user, roomName);
        user.name = username;
        joinRoom(user, roomName);
        console.log(username);
        console.log("Room %s now being hosted by %s", roomName, username);
    });

    // Check if user is able to join the room, if so then add them
    socket.on('join', function(joinObj) {
        var response;
        var roomName = joinObj.roomName;
        var username = joinObj.username;
        if(!(roomName in rooms)){
            response = "invalid";
        } else if(!room['state'] == 'lobby'){
            response = "ingame";
        } else if(room['users'].length >= ROOM_LIMIT){
            response = "full";
        } else if(user in rooms[roomName]['Users']){
            reponse = "already joined";
        } else {
            user.name = username;
            response = "ok";
            joinRoom(user, roomName);
        }
        socket.emit('join-response', response);
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
function joinRoom(user, roomName){
    var room = rooms[roomName];
    room['users'].push(user);
    user['socket'].join(roomName);
    io.to(roomName).emit('usernames', generateUsernamesFromRoom(room));
}

// Generates a list of the usernames of all users in the room
function generateUsernamesFromRoom(room){
    var names = [];
    room['users'].map(user => names.push(user.name));
    return names;
}

function randomLetters(n){
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var letters = [];
    
    for(i=0;i<n;i++){
        letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    return letters.join("");
}