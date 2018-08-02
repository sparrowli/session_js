// Require websocket library
var WebSocketServer = require('ws').Server;

// Create a websocket server at port 19800
var wss = new WebSocketServer({port: 19800});

// Listen to the connection event
wss.on('connection', function(connection) {
	console.log("user connected");

	// Listen to any messages sent by the connected user
	connection.on('message', function(message) {
		console.log("Got message from a user:", message);
	});

	// Send a response to the connected user
	connection.send("hello from server");
});
