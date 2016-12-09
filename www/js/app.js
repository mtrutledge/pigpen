document.addEventListener("DOMContentLoaded", function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('gameBoard');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth;
   var height  = window.innerHeight;
   var socket  = io.connect();

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // Normalize mouse position so we dont have to worry about window sizes
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
   };

   // draw line received from server
	socket.on('drawEvent', function (data) {
      var line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height); // De-Normalize the position
      context.lineTo(line[1].x * width, line[1].y * height); // De-Normalize the position
      context.stroke();
   });

   // main loop, running every 25ms
   function mainLoop() {
     drawDotGrid(context, 10, 10);
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('drawEvent', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   mainLoop();
});

var dotMargin = 25;
var xMargin = dotMargin;
var yMargin = dotMargin;
var dotDiameter = 5;
var dotRadius = dotDiameter * 0.5;

function drawDotGrid(context, numRows, numCols) {
  for(var row = 0; row < numRows; row++) {
  	for(var col = 0; col < numCols; col++) {
  		var x = (col * (dotDiameter + xMargin)) + dotMargin + (xMargin / 2) + dotRadius;
  		var y = (row * (dotDiameter + yMargin)) + dotMargin + (yMargin / 2) + dotRadius;
  		drawDot(context, x, y, dotRadius);
  	}
  }
}

function drawDot(context, x, y, radius) {
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = '#000000';
	context.fill();
}
