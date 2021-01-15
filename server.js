// Express
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Socket
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Misc
var fs = require('fs');
var util = require('util');
const crypto = require("crypto");

var dataObj;
var matchInfo = {}; // seasonNumber -> [matchInfoObj]
var rooms = {}; // roomName -> room
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
        rooms[roomName] = new Room(user, roomName);
        room = rooms[roomName];
        user.name = username;
        joinRoom(user, roomName, room);
        socket.emit('host-response', "ok");
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
            user.name = username.substring(0, 16);
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

    socket.on('start-game', () => {
        if('host' in room && room.host == user && room.state === 'lobby'){
            startGame(room);
        }
    });

    socket.on('setting-interrupt-change', (request) => {
        if('host' in room && room.host == user && room.state === 'lobby'){
            room.settings.interrupt = request;
            socket.to(room.name).emit('setting-interrupt-change', request);
        }
    });

    socket.on('setting-override-change', (request) => {
        if('host' in room && room.host == user && room.state === 'lobby'){
            room.settings.override = request;
            socket.to(room.name).emit('setting-override-change', request);
        }
    });

    socket.on('setting-season-change', (request) => {
        if ('host' in room && room.host == user && room.state === 'lobby'
            && request in dataObj) {
            room.game.season = request;
            socket.to(room.name).emit('setting-season-change', request);

        }
    });

    socket.on('setting-match-change', (request) => {
        if('host' in room && room.host == user && room.state === 'lobby'
            && 'season' in room.game && room.game.season in dataObj){
            // Ensure match exists in data object
            if (getFrames(room.game.season, request)){
                room.game.match = request;
                socket.to(room.name).emit('setting-match-change', request);
            }
        }
    });

    socket.on('request-lobby-settings', () => {
        socket.emit('matches-list-response', matchInfo);
        if('host' in room){
            var isHost = room.host === user;
            socket.emit('is-host-response', isHost);
        }
        socket.emit('setting-interrupt-change', room.settings['interrupt']);
        socket.emit('setting-override-change', room.settings.override);
        if(room.game.season){
            socket.emit('setting-season-change', room.game.season);
        }
        if(room.game.match){
            socket.emit('setting-match-change', room.game.match);
        }
    });

    socket.on('start-game-request', () => {
        if('host' in room && user === room.host && room.state === 'lobby'
            && 'match' in room.game){
            setUpGame(room);
            io.to(room.name).emit('start-game');
            console.log("Room %s: Game started", room.name);
        }
    });

    socket.on('request-scores', () => {
        broadcastScore(room, false, socket);
    });

    socket.on('add-200', () => {
        modifyScore(room, user.id, 200);
    });
});

// Load in data from file
fs.readFile('data/data.json', 'utf8', function (err, data) {
  if(err){
     throw Error('Could not load data from file') 
  }
  dataObj = JSON.parse(data);
});

// Attempt to pull out season, id, and date from all matches
var attemptRead = setInterval(tryToRead, 100);

function tryToRead(){
    if('35' in dataObj){
        clearInterval(attemptRead);
        pullMatchInfo();
    }
}

function Game(){
    this.match = null;
    this.season = null;
    this.scores = {}; // uid -> score
}

function User(socket){
    this.id = crypto.randomBytes(16).toString("hex");
    this.socket = socket;
    this.name = "";
}

function Room(user, roomName){
    this.game = new Game(); // Resets when the game ends
    this.users = [];
    this.host = user;
    this.name = roomName;
    this.state = 'lobby';
    this.settings = {
        interrupt: false,
        override: true
    };
}

function modifyScore(room, uid, amount){
    currentScore = room.game.scores[uid];
    if(currentScore + amount < 0){
        room.game.scores[uid] = 0;
    } else{
        room.game.scores[uid] = currentScore + amount; 
    }
    broadcastScore(room, true);
}

// Sets up the game, zeroing out scores, getting the frames,
function setUpGame(room){
    room['users'].forEach((user) => room.game.scores[user.id] = 0);
    room.game.frames = getFrames(room.game.season, room.game.match);
}

// Grabs the frames for the given season and match
function getFrames(season, matchNum){
    var frames = [];
    if (season in dataObj) {
        dataObj[season].forEach((match) => {
            if (match.id == matchNum) {
                frames.push(match.frames);
            }
        });
    }
    return frames;
}

// Creates the matchInfo object for host to choose a match
function pullMatchInfo(){
    Object.keys(dataObj).forEach(function(season) {
        var matches = [];
        dataObj[season].forEach(function(match) {
            var iso_date = match["date"];
            var american_date = iso_date.slice(5) + '-' + iso_date.slice(0, 4);
            matches.push({
                "id": match["id"],
                "date": american_date
            })
        });
        matchInfo[season] = matches;
    });
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

// Broadcasts the score for the given room, and only to given socket if sendAll=false
function broadcastScore(room, sendAll, socket = null){
    scores = [];
    room['users'].forEach((user) => {
        scores.push({'name': user.name, 'score': room.game.scores[user.id]});
    });
    if(sendAll){
        io.to(room.name).emit('request-scores-response', scores);
    } else{
        socket.emit('request-scores-response', scores);
    }
}

// Broadcasts usernames for given room
function broadcastUsernames(room){
    io.to(room.name).emit('usernames', 
    {
        users: room['users'].filter((user) => user.name != room.host.name)
            .map((user) => user.name),
        hostName: room.host.name
    });
    console.log("broadcasted names");
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