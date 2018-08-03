
var connection = new WebSocket('ws://localhost:19800');
var name = "";

var loginInput = document.querySelector('#loginInput');
var loginBtn = document.querySelector('#loginBtn');

var peerUserNameInput = document.querySelector('#peerUserNameInput');
var connect2PeerUserNameBtn = document.querySelector('#connect2PeerUserNameBtn');

var connectedUser;
var myConnection;

connect2PeerUserNameBtn.addEventListener("click", function() {

	var peerUserName = peerUserNameInput.value; 
  connectedUser = peerUserName;

	if (peerUserName.length > 0) {
		// make an offer
		myConnection.createOffer(function (offer) {
			console.log("Create an offer", offer);
			send({
				type: "offer",
				offer: offer
			});

			myConnection.setLocalDescription(offer);
		}, function (error) {
			alert("An error has occurred.");
		});

	}

});

// When somebody wants to call us
function onOffer(offer, name) {
	connectedUser = name;
	myConnection.setRemoteDescription(new RTCSessionDescription(offer));

	myConnection.createAnswer(function (answer) {
		myConnection.setLocalDescription(answer);

		send({
			type: "answer",
			answer: answer
		});
	}, function (error) {
		alert("oooooooooops....error");
	});
}

// when another user answers to our offer
function onAnswer(answer) {
	myConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// When we got ice candidate from another user
function onCandidate(candidate) {
	myConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

loginBtn.addEventListener("click", function(event) {
	name = loginInput.value;

	if (name.length > 0) {
		send({
			type: "login",
			name: name
	  });
	}
});

connection.onmessage = function(message) {
	console.log("Got message", message.data);
	var data = JSON.parse(message.data);

	switch (data.type) {
		case "login":
			onLogin(data.success);
			break;
		case "offer":
			onOffer(data.offer, data.name);
			break;
		case "answer":
			onAnswer(data.answer);
			break;
		case "candidate":
			onCandidate(data.candidate);
			break;
		default:
			break;
	}
};


function onLogin(success) {

	if (success == false) {
		alert("ooooooops...try a different username");
	} else {
		// Create RTCPeerConnection object

		// STUN servers are used by both clients to determine their IP address
		// as be visible by the global Internet
		var configuration = {
			"iceServers": [{ "url": "stun:stun.1.google.com:19302" }]
		};

		myConnection = new webkitRTCPeerConnection(configuration);
		console.log("RTCPeerConnection object was created");
		console.log(myConnection);

		// setup ice handling
		// when the browser finds an ice candidate we send it to another peer
		myConnection.onicecandidate = function (event) {

			// Send all found icecandidates to the other peer
			if (event.candidate) {
				send({
					type: "candidate",
					candidate: event.candidate
				});

			}

		};

	}

};

connection.onopen = function() {
	console.log("Connected");
};

connection.onerror = function(err) {
	console.log("Got error", err);
};

function send (message) {

	if (connectedUser) {
		message.name = connectedUser;
	}

	connection.send(JSON.stringify(message));
};
