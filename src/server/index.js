var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var THREE = require('three');
 
var state = {
    stage: 'assets/main.json',
    players: {}
};

app.use(express.static(path.join(__dirname, '../client')));

app.use('/modules',express.static(path.join(__dirname, '../../node_modules')));

app.get('/', (request, response)=>{
    console.log(request.url);
    response.sendFile(path.join(__dirname, '../client', 'index.html'));
});

io.on('connection', (socket) => {

    //spawn new player 
    state.players[socket.id] = {
        position: new THREE.Vector3(0 , 0 , 0),
    };
    //set new player data
    socket.emit('init_client', state);

    //update player
    socket.on('update_player', function(player){
        state.players[socket.id] = player;
    });

    //new player
    socket.broadcast.emit('new_player', socket.id);

    //disconnect player
    socket.on('disconnect', function() {
        console.log('user disconnected');
        delete state.players[socket.id];
    });
});

//emit game state
setInterval(() => {
    io.sockets.emit('update', state);
}, 1000 / 60);


http.listen(3000, function(){
    console.log('listening on *:3000');
});