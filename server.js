// Require websocket library
var WebSocketServer = require('ws').Server;

// Create a websocket server at port 19800
var wss = new WebSocketServer({port: 19800});

var users = {};
// Listen to the connection event
wss.on('connection', function(connection) {
	console.log("user connected");

	connection.on("close", function() {
		if (connection.name) {
			delete users[connection.name];
		}
	});

	// Listen to any messages sent by the connected user
	connection.on('message', function(message) {
		console.log("Got message from a user:", message);
		var data;
		// Accepting only JSON messages
		try {
			data = JSON.parse(message);
		} catch (e) {
			console.log("Invalid JSON");
			data = {};
		}

		switch (data.type) {
			case "login":
				console.log("User logged:", data.name);

				if (users[data.name]) {
					sendTo(connection, {
						type: "login",
						success: false,
						message: "The user has already logged in"
					});
				} else {
					users[data.name] = connection;
					connection.name = data.name;

					sendTo(connection, {
						type: "login",
						success: true
					});
				}

				break;
			default:
				sendTo(connection, {
					type: "error",
					message: "Command no found: " + data.type
				});

				break;
		}

	});

	// Send a response to the connected user
	connection.send("hello from server");
});

function sendTo(connection, message) {
	connection.send(JSON.stringify(message));
}
