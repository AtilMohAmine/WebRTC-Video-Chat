const express = require('express');
const app = express();

var http = require('http').Server(app);


app.use(express.static('public'));

const { PeerServer } = require('peer');

const peerServer = PeerServer({ port: 9000, path: '/myapp' });

http.listen(3000);
