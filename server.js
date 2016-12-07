//////////////////////////////////////////////////////
// Import node modules
//////////////////////////////////////////////////////
var express = require('express'),
    app = express(), // Create the app
    http = require('http'),
    socketIo = require('socket.io');

//////////////////////////////////////////////////////
// start webserver on port 8080
//////////////////////////////////////////////////////
var server =  http.createServer(app);
var io = socketIo.listen(server);
//server.listen(8080);

//////////////////////////////////////////////////////
// Tell express web server where our html lives
//////////////////////////////////////////////////////
app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/www'));
console.log("Server running on 127.0.0.1:8080");

//////////////////////////////////////////////////////
// Store the lines drawn
//////////////////////////////////////////////////////
var linesDrawn = [];

//////////////////////////////////////////////////////
// Hook up events for new connections that come in to the server
//////////////////////////////////////////////////////
io.on('connection', function (socket) {
  // Send all history to the client that connected
  for (var i in linesDrawn) {
    socket.emit('drawEvent', { line: linesDrawn[i] } );
  }

  // Add "drawEvent" message handler.
  socket.on('drawEvent', function (data) {
    // Add received line to history
    linesDrawn.push(data.line);
    // Send line to all clients
    io.emit('drawEvent', { line: data.line });
  });
});
