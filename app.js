const express = require('express');
const { Server } = require("socket.io");
const http = require('http');
const path = require('path');

// app setup 
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;


// static files
app.use(express.static(path.join(__dirname, "public")));

// this snippet gets the local ip of the node.js server
// copy this ip to the client side code and add ':3000'
require("dns").lookup(require("os").hostname(), function (err, add, fam) {
  console.log(`http://${add}:${PORT}`);
  
});


app.get('/', (req,res)=>{
  // res.sendFile('index.html',{ root: path.join(__dirname, './public') })
  res.send("Hello from Server")
})

app.get('/broadcast', (req,res)=>{
  res.sendFile('broadcast.html',{ root: path.join(__dirname, './public') })
})

app.get('/receiver', (req,res)=>{
  res.sendFile('receiver.html',{ root: path.join(__dirname, './public') })
})

io.on('connection', (socket) => {
  console.log('user connected');
});

server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);

});