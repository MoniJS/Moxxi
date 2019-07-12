var socket = io.connect();

var room = "dev";

socket.on('connect', function(){
    socket.emit('room', room);
});