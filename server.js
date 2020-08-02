/// SOURCE: https://www.youtube.com/watch?v=JljMBn69fZM

var express = require('express');
var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log('new connection:' + socket.id);
	socket.on('drawing',mouseMsg);
	function mouseMsg(data){
		//io.sockets.emit('mouse', data);
		//***if we want the communication specific to socket***//*
		socket.broadcast.emit('mouse', data); 
		console.log(data);
	}
}
