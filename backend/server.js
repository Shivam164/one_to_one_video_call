const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*'
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`listening to PORT : ${PORT}`);
})

const io = socketio(server,{
    pingTimeout : 120000,
    cors : {
        origin : "*"
    }
});

let users = {};
let rooms = [];
let peers = [];

io.on('connection', (socket) => {
    console.log("client connected");

    socket.emit('all peers', peers);

    socket.on('peer id', id => {
        peers.push(id);
        users[socket.id] = id;
        socket.broadcast.emit('new peer', id);
        console.log("New peer id: ", id);
    })

    socket.on('disconnect', () => {
        peers = peers.filter(peer => peer !== users[socket.id]);
        socket.broadcast.emit('peer left', users[socket.id]);
        console.log('Client disconnected', peers.length);
    });
});