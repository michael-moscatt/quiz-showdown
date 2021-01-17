/* ******************************************* Imports ********************************************/

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

/* ********************************************* Globals ******************************************/

const DATA_FILE_NAME = "data.json";
const DATA_FILE_PATH = "data";
const ROOM_LIMIT = 4;
const POINT_VALUES = [200,400,600,800,1000];
const TIME_AFTER_Q_ENDS_MS = 5000; // Time after question ends before buzzing is disallowed
var dataObj;
var matchInfo = {}; // seasonNumber -> [matchInfoObj]
var rooms = {}; // roomName -> room

/* ******************************************* Load in data ***************************************/

// Read from data file
fs.readFile(DATA_FILE_PATH + '/' + DATA_FILE_NAME, 'utf8', function (err, data) {
    if (err) {
        throw Error('Could not load data from file')
    }
    dataObj = JSON.parse(data);
});

// Attempt to pull out season, id, and date from all matches
var readInterval = setInterval(tryToRead, 100);
function tryToRead() {
    if ('35' in dataObj) {
        clearInterval(readInterval);
        pullMatchInfo();
    }
}

// Create the matchInfo object that holds all questions
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

/* *********************************** Start Server ***********************************************/

http.listen(port, function() {
    console.log('Server running. Port: ' + port);
});

/* ************************************ Listeners *************************************************/

// Create user on connection, set listeners for the menu
io.on('connection', function (socket) {
    var user = new User(socket);
    var room = {};
    setMenuListeners(user, room);

    socket.on('disconnect', function() {
        console.log(user.name ? user.name : "Anonymous" + " has disconnected.");
        if('users' in room){
            leaveRoom(user, room);
        }
    });    
});

// Set the listeners for a user that is on the menu
function setMenuListeners(user, room){
    var socket = user.socket;

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
}

// Remove the listeners for a user that leaves the menu
function removeMenuListeners(user){
    var socket = user.socket;

    socket.removeAllListeners('host');
    socket.removeAllListeners('join');
}


// Sets the listeners for a user that is in a lobby
function setLobbyListeners(user, room){
    var socket = user.socket;

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
            if ('single' in getFrames(room.game.season, request)){
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
            startGame(room);     
        }
    });
}

// Remove the listeners for a user in the lobby
function removeLobbyListeners(user){
    var socket = user.socket;

    socket.removeAllListeners('request-usernames');
    socket.removeAllListeners('request-room-name');
    socket.removeAllListeners('setting-interrupt-change');
    socket.removeAllListeners('setting-override-change');
    socket.removeAllListeners('setting-season-change');
    socket.removeAllListeners('setting-match-change');
    socket.removeAllListeners('request-lobby-settings');
    socket.removeAllListeners('start-game-request');
}

// Set the listeners for a user in the game
function setGameListeners(user, room){
    var socket = user.socket;

    socket.on('request-name', () => {
        socket.emit('name', user.name);
    });

    socket.on('request-scores', () => {
        broadcastScore(room, false, socket);
    });

    socket.on('request-categories', () => {
        socket.emit('categories', getCategories(room));
    });

    socket.on('request-question-values', () => {
        socket.emit('question-values', getValues(room));
    });

    socket.on('request-turn-name', () => {
        socket.emit('turn-name', room.game.turn.name);
    });

    socket.on('request-take-turn', (index) => {
        if(room.game.turn == user && room.game.values[index] && !room.game.questionActive){
            takeTurn(room, index);
        }
    });

    socket.on('request-buzz', () => {
        if(room.game.questionActive){
            console.log("Buzz that counted");
        } else{
            console.log("Buzz that didn't count");
        }
    });
}

// Remove the listeners for a user who is no longer in game
function removeGameListeners(user){
    var socket = user.socket;

    socket.removeAllListeners('request-name');
    socket.removeAllListeners('request-scores');
    socket.removeAllListeners('request-categories');
    socket.removeAllListeners('request-question-values');
    socket.removeAllListeners('request-turn-name');
    socket.removeAllListeners('request-take-turn');
    socket.removeAllListeners('request-buzz');
}

/* ***************************************** Constructors *****************************************/

function Question(){
    this.curIndex = 0;
    this.wordList = [];
    this.value = 0;
    this.transmissionTimer = null;
}

function Game(){
    this.match = null;
    this.season = null;
    this.scores = {}; // uid -> score
    this.frames = {};
    this.frame = [];
    this.part = ''; // single, double, final
    this.values = [];
    this.turn = null;
    this.question = new Question();
    this.questionActive = false;
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
        override: true,
        delay: 250
    };
}

/* *********************************** Menu Functions *********************************************/

// Joins the given user to the room, informs other players
function joinRoom(user, roomName, room){
    room = rooms[roomName];
    room['users'].push(user);
    user['socket'].join(roomName);
    broadcastUsernames(room);
    removeMenuListeners(user);
    setLobbyListeners(user, room);
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

/* *********************************** Lobby Functions ********************************************/

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

// Makes a new player the host
function newHost(){
    // broadcast usernames
    // broadcast is-Host-Response
}

// Sets up the game, zeroing out scores, getting the frames, set up single jeopardy
// Set turn to host, remove listeners for lobby actions
function startGame(room){

    room['users'].forEach((user) => room.game.scores[user.id] = 0);
    room.state = 'game';
    room.game.frames = getFrames(room.game.season, room.game.match);
    room.game.frame = room.game.frames['single'];
    room.game.part = 'single';
    room.game.values = getValuesList(room);
    room.game.turn = room.host;
    room.users.forEach(user => 
        {
            removeLobbyListeners(user);
            setGameListeners(user, room);
        });
    io.to(room.name).emit('start-game');
    console.log("Room %s: Game started", room.name);
}

/* *********************************** Game Functions *********************************************/

function modifyScore(room, uid, amount){
    currentScore = room.game.scores[uid];
    if(currentScore + amount < 0){
        room.game.scores[uid] = 0;
    } else{
        room.game.scores[uid] = currentScore + amount; 
    }
    broadcastScore(room, true);
}

// Reads the selected question, given by the index
function takeTurn(room, index){
    var categoryData = room.game.frame[index % 6];
    var questionData = categoryData.cards[Math.floor(index/6)];
    var question = room.game.question;
    question.wordList = questionData.hint.split(" ");
    question.curIndex = 0;
    if(questionData.double){

    } else{
        question.value = room.game.values[index];
        if(room.settings.interrupt){
            room.game.questionActive = true;
        }
        let category = categoryData.name;
        io.to(room.name).emit('question-info', category, question.value);
        question.transmissionTimer = setInterval(transmitQuestion, room.settings.delay, room);
    }

}

// Transmits the question to the given room
function transmitQuestion(room){
    var question = room.game.question;
    var string = question.wordList.slice(0,question.curIndex+1).join(" ");
    io.to(room.name).emit('question', string);
    question.curIndex = question.curIndex + 1;

    if(question.curIndex == question.wordList.length){
        room.game.questionActive = true;
        clearInterval(question.transmissionTimer);
        setTimeout(endTurn, TIME_AFTER_Q_ENDS_MS, room);
    }
}

// Ends the turn for the given room
function endTurn(room){
    room.game.questionActive = false;
}

// Gets the question values for a given room, using the room.game.values list
// [[200, 200, 200...], [400, null, 400], ...]
function getValues(room){
    var values = [];
    for(i = 0;i < 5; i++){
        var row = [];
        for(j=0;j<6;j++){
            row.push(room.game.values[(i*6)+j]);
        }
        values.push(row);
    }
    return values;
}

// Gets the question values for a given room, as a list (all 200s first, then 400s, etc)
function getValuesList(room) {
    var mult = room.game.part == 'single' ? 1 : 2;
    var colWise = room.game['frame'].map((category) =>
        category.cards.map((card) =>
            card.answer ? POINT_VALUES[card.position - 1] * mult : null
        )
    );
    var listWise = [];
    for(i = 0;i < colWise[0].length;i++){
        for(j=0;j < colWise.length; j++){
            listWise.push(colWise[j][i]);
        }
    }
    return listWise;
}

// Gets the categories for the given room
function getCategories(room){
    return room.game['frame'].map((category) => {
        return {
            "name": category.name,
            "comments": category.comments
        }
    });
}

// Grabs the frames for the given season and match
function getFrames(season, matchNum){
    var frames = {};
    if (season in dataObj) {
        dataObj[season].forEach((match) => {
            if (match.id == matchNum) {
                frames = match.frames;
            }
        });
    }
    return frames;
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
}