const express = require('express');
const {Server} = require('socket.io');
const http = require('http');
const path = require('path');

// app setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

// static files
app.use(express.static(path.join(__dirname, 'public')));

// this snippet gets the local ip of the node.js server
// copy this ip to the client side code and add ':3000'
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log(`http://${add}:${PORT}`);
});

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, './public')});
});

// app.get('/broadcast', (req, res) => {
//   res.sendFile('broadcast.html', {root: path.join(__dirname, './public')});
// });

app.get('/receiver', (req, res) => {
  res.sendFile('receiver.html', {root: path.join(__dirname, './public')});
});

io.on('connection', socket => {
  console.log('user connected');
  socket.on('offer', offer => {
    console.log('[offer]:', offer);
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', answer => {
    console.log('[answer]:', answer);
    socket.broadcast.emit('answer', answer);
  });

  socket.on('candidate', candidate => {
    console.log('[candidate]:', candidate);
    socket.broadcast.emit('candidate', candidate);
  });

  socket.on('call', () => {
    socket.broadcast.emit('call');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
