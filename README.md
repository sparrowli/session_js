###environment

```
$ brew install nodejs
$ node xxx[.js]
# static web server
$ npm install -g node-static
# startup web server with default ip - 127.0.0.1 and port - 8080
$ static 
# WebSockets lib: abidirectional socket connection between two endpoints
# - a web server and a web browser
$ npm install ws
$ npm install -g wscat
# Act as a browser to connect the signaling server
$ wscat -c ws://localhost::19800
```

###Make a call

$ wscat -c ws://localhost::19800 --no-color --slash
# sparrow and jane login in 
`{"name": "sparrow", "type": "login"}`
`{"name": "jane", "type": "login"}`
# jane call sparrow by creating an offer
# createOffer
`{"name": "sparrow", "type": "offer"}`
# sparrow answer jane
# createAnswer
`{"name": "jane", "type": "answer"}`
**Note:** instead of those with SDP data

# Handle ICE candidate
`{"name": "jane", "type": "candidate", "candidate": "192.168.100.5"}`
`{"name": "sparrow", "type": "candidate", "candidate": "192.168.100.10"}`
**Note:** Might happen multiple times
