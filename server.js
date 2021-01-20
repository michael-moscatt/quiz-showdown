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
const TIME_AFTER_Q_ENDS_DD_MS = 10000; // Time after a question ends before buzzing is disallowed DD
const TIME_LOCKOUT_MS = 250; // Lockout period for an illegal buzz
const TIME_TO_ANSWER_MS = 5000; // Time player has to answer after buzzing
const TIME_AFTER_SELECTION_MS = 1500; // Time after player selects question before it's read
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
        console.log(user.name ? user.name + " has disconnected." : 
            "Anonymous" + " has disconnected.");
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

// Set the listeners for a user on the board
function setBoardListeners(user, room){
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
        broadcastQuestionValues(user, room);
    });

    socket.on('request-turn-name', () => {
        socket.emit('turn-name', room.game.turn.name);
    });

    socket.on('request-take-turn', (index) => {
        if(room.game.turn == user && room.game.values[index] && !room.game.questionActive){
            startQuestion(room, user, index);
        }
    });
}

// Remove the listeners for a user who is no looking at the board
function removeBoardListeners(user){
    var socket = user.socket;

    socket.removeAllListeners('request-name');
    socket.removeAllListeners('request-scores');
    socket.removeAllListeners('request-categories');
    socket.removeAllListeners('request-question-values');
    socket.removeAllListeners('request-turn-name');
    socket.removeAllListeners('request-take-turn');
}

// Set the listener for players who can buzz
function setQuestionListeners(user, room){
    var socket = user.socket;

    socket.on('request-buzz', () => {
        if(!room.game.lockoutList[user.id]){
            if(room.game.questionActive){
                playerBuzz(user, room);
            } else{
                lockout(user, room);
            }
        } else{
            console.log("Buzz: Locked out");
        }
    });
}

// Remove the listeners for players who can no longer buzz
function removeQuestionListeners(user){
    var socket = user.socket;

    socket.removeAllListeners('request-buzz');
}

/* ***************************************** Constructors *****************************************/

function Question(){
    this.index = 0;
    this.curIndex = 0;
    this.wordList = [];
    this.value = 0;
    this.transmissionTimer = null;
    this.timeToLiveTimer = null;
    this.playerAnswer = '';
    this.completedTransmission = false;
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
    this.lockoutList = {} // uid -> boolean (true means they are locked out)
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
            setBoardListeners(user, room);
        });
    io.to(room.name).emit('start-game');
    console.log("Room %s: Game started", room.name);
}

/* *********************************** Game Functions *********************************************/

// Checks if the answer for the question is correct
function verifyAnswer(answer, room){
    return false;
}

// Lockout the given user, for the duration if isPermanent is false, 
// else for the rest of the question
function lockout(user, room, isPermanent){
    let socket = user.socket;
    room.game.lockoutList[user.id] = true;
    socket.emit('lockout-start');
    if (!isPermanent) {
        setTimeout((user, room) => {
            room.game.lockoutList[user.id] = false;
            socket.emit('lockout-end');
        }, TIME_LOCKOUT_MS, user, room);
    }
}

function modifyScore(room, uid, amount){
    room.game.scores[uid] += amount; 
    broadcastScore(room, true);
}

// Reads the selected question
function startQuestion(room, user, index){
    let categoryData = room.game.frame[index % 6];
    let category = categoryData.name;
    let questionData = categoryData.cards[Math.floor(index/6)];
    let question = room.game.question;
    let double = questionData.double;
    let values = double ? getValues(room, index, 'double') : getValues(room, index, 'selected');
    room.users.forEach((user) => {
        room.game.lockoutList[user.id] = false;
        removeBoardListeners(user);
        setQuestionListeners(user, room);
        user.socket.emit('question-values', values);
    });
    question.completedTransmission = false;
    question.wordList = questionData.hint.split(" ");
    question.curIndex = 0;
    question.index = index;
    setTimeout(() => {
        if(questionData.double){
            let socket = user.socket
            let maxOnBoard = room.game.part === 'single' ? 1000 : 2000;
            let max = Math.max(room.game.scores[user.id], maxOnBoard);
            socket.emit('daily-double', max);
            room.users.forEach((roomUser) => {
                roomUser === user ? false : lockout(roomUser, room, true)
            });
            socket.on('daily-double-wager', (wager) => {
                socket.removeAllListeners('daily-double-wager');
                question.value = Math.min(Math.max(wager, 0), max);
                preTransmitQuestion(room, category, question, questionData.double, user);
            })
        } else{
            question.value = room.game.values[index];
            preTransmitQuestion(room, category, question, questionData.double, user);
            if(room.settings.interrupt){
                room.game.questionActive = true;
            }
        }
    }, TIME_AFTER_SELECTION_MS);
}

// Preps the players before the question is transmitted
function preTransmitQuestion(room, category, question, double, user){
    io.to(room.name).emit('question-info', category, question.value);
    question.transmissionTimer = 
        setInterval(transmitQuestion, room.settings.delay, room, double, user);
}

// Transmits the question to the given room, taking into account of the question is a daily double
function transmitQuestion(room, double, user){
    var question = room.game.question;
    var string = question.wordList.slice(0,question.curIndex+1).join(" ");
    io.to(room.name).emit('question', string);
    question.curIndex = question.curIndex + 1;

    if(question.curIndex == question.wordList.length){
        room.game.question.completedTransmission = true;
        room.game.questionActive = true;
        clearInterval(question.transmissionTimer);
        if (double) {
            room.game.question.timeToLiveTimer = setTimeout(() => {
                modifyScore(room, user.id, room.game.question.value*-1);
                endQuestion(room);
            }, TIME_AFTER_Q_ENDS_DD_MS);
        } else {
            room.game.question.timeToLiveTimer =
                setTimeout(endQuestion, TIME_AFTER_Q_ENDS_MS, room);
        }
    }
}

// Inform players that the player has made a legal buzz
function playerBuzz(user, room){
    let socket = user.socket;
    let question = room.game.question;
    if(!question.completedTransmission){
        clearInterval(question.transmissionTimer);
    } else{
        clearTimeout(question.timeToLiveTimer);
    }
    socket.to(room.name).emit('opponent-buzz', user.name);
    socket.emit('buzz-accepted');
    room.game.questionActive = false;
    lockout(user, room, true);
    question.playerAnswer = '';

    const answerTimer = setTimeout((user, room) => {
        playerAnswer(user, question.playerAnswer, room);
    }, TIME_TO_ANSWER_MS, user, room);

    socket.on('answer-stream', (answer) => {
        question.playerAnswer = answer;
        socket.to(room.name).emit('answer-stream', answer);
    });

    socket.on('final-answer', (answer) => {
        clearTimeout(answerTimer);
        playerAnswer(user, answer, room);
    }); 
}

// Score the player's answer
function playerAnswer(user, answer, room){
    let correct = verifyAnswer(answer, room);
    if(correct){
        modifyScore(room, user.id, room.game.question.value);
        room.game.turn = user;
        endQuestion(room);
    } else{
        modifyScore(room, user.id, room.game.question.value*-1);
        cleanupIncorrectPlayerBuzz(room, user.socket);
    }
}

// Cleans up after a player buzzes incorrectly
function cleanupIncorrectPlayerBuzz(room, socket){
    socket.removeAllListeners('answer-stream');
    socket.removeAllListeners('final-answer');

    var question = room.game.question;
    if(room.users.reduce((acc, user) => !room.game.lockoutList[user.id] || acc, false)){
        socket.to(room.name).emit('opponent-wrong-answer');
        socket.emit('wrong-answer');
        room.game.questionActive = true;
        if(question.completedTransmission){
            question.timeToLiveTimer = setTimeout(endQuestion, TIME_AFTER_Q_ENDS_MS, room);
        } else{
            question.transmissionTimer = setInterval(transmitQuestion, room.settings.delay, room);
        }
        
    } else{
        endQuestion(room);
    }
}

// Ends the question for the given room
function endQuestion(room){
    room.game.values[room.game.question.index] = null;
    room.users.forEach((user) => {
        removeQuestionListeners(user);
        setBoardListeners(user, room);
        broadcastQuestionValues(user, room);
    });
    room.game.questionActive = false;
    io.to(room.name).emit('question-over');
}

// Gets the question values for a given room, pairing with a status
// If the index is given (not null), it pairs that index with the given type
// If index is not given, it pairs all values with 'unselected'
// [[200, 200, 200...], [400, null, 400], ...]
function getValues(room, index, type = 'unselected'){
    var values = [];
    for(i = 0;i < 5; i++){
        var row = [];
        for(j=0;j<6;j++){
            let total = (i*6)+j;
            let defType = 'unselected';
            if(index && total==index){
                defType = type;
            }
            row.push([room.game.values[total], defType]);
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

// Broadcasts the values of the question for the room
function broadcastQuestionValues(user, room){
    user.socket.emit('question-values', getValues(room, null));
}