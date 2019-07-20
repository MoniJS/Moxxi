var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var state = {
    players: []
};

app.use(express.static(path.join(__dirname, '../client')));

app.use('/modules',express.static(path.join(__dirname, '../../node_modules')));

app.get('/', (request, response)=>{
    console.log(request.url);
    response.sendFile(path.join(__dirname, '../client', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    socket.on('disconnect', function() {
      console.log('user disconnected');
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});