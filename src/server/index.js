var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var state = {

};


io.on('connection', (socket)=>{

    //connect socket to room they want to join
    socket.on('room', (room)=>{
        socket.join(room);
    });

});


http.listen(3000, function(){
    console.log('listening on *:3000');
});