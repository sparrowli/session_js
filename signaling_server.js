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

			if (connection.otherName) {
				console.log("Disconnecting from ", connection.otherName);
				var conn = users[connection.otherName];
				conn.otherName = null;

				if (conn != null) {
					sendTo(conn, {
						type: "leave"
					});
				}
			}
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
			case "offer":
				// e.g. Caller A wants to call callee B
				console.log("sending offer to: ", data.name);

				// If user B exists then send him offer details
				var conn = users[data.name];

				if (conn != null) {
					// Setting that userA connected with userB
					connection.otherName = data.name;

					sendTo(conn, {
						type: "offer",
						offer: data.offer,
						name: connection.name
					});
				}

				break;

			case "answer":
				console.log("Sending answer to: ", data.name);

				// e.g. User B answers caller A
				var conn = users[data.name];

				if (conn != null) {
					connection.otherName = data.name;
					sendTo(conn, {
						type: "answer",
						answer: data.answer
					});
				}

				break;
			case "candidate":
				console.log("Sending candidate to: ", data.name);
				var conn = users[data.name];

				if (conn != null) {
					sendTo(conn, {
						type: "candidate",
						candidate: data.candidate
					});
				}

				break;
			case "leave":
				console.log("Disconnecting from ", data.name);
				var conn = users[data.name];
				conn.otherName = null;

				if (conn != null) {
					sendTo(conn, {
						type: "leave"
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
