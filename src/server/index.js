var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '../client')));

app.use('/modules',express.static(path.join(__dirname, '../../node_modules/three/src')));

app.get('/', (request, response)=>{
    console.log(request.url);
    response.sendFile(path.join(__dirname, '../client', 'index.html'));
});

io.on('connection', (socket)=>{
    

});


http.listen(3000, function(){
    console.log('listening on *:3000');
});