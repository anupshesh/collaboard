window.onload = function()
{

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var colorInput = document.getElementById("color");

//Color listener
colorInput.addEventListener('input',()=>{
	var color = colorInput.value;
		ctx.strokeStyle = color;
	});

//Touch listerners

canvas.addEventListener('touchstart', touchstart, false);
canvas.addEventListener('touchmove', touchmove, false);
canvas.addEventListener('touchend', touchend, false);

//Variables
var canvasx = $(canvas).offset().left;
var canvasy = $(canvas).offset().top;
var last_mousex = last_mousey = 0;
var mousex = mousey = 0;
var mousedown = false;
var last_touchx = last_touchy = 0;
var touchx = touchy = 0;
var touchstart = false
var tooltype = 'draw';

//Mousedown
$(canvas).on('mousedown', function(e) {
    last_mousex = mousex = parseInt(e.clientX-canvasx);
	last_mousey = mousey = parseInt(e.clientY-canvasy);
    mousedown = true;
});

//Mouseup
$(canvas).on('mouseup', function(e) {
    mousedown = false;
});

//Mousemove
$(canvas).on('mousemove', function(e) {
    mousex = parseInt(e.clientX-canvasx);
    mousey = parseInt(e.clientY-canvasy);
    if(mousedown) {
        ctx.beginPath();
        if(tooltype=='draw') {
            ctx.globalCompositeOperation = 'source-over';

            ctx.lineWidth = 3;
		
        } else {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 50;
        }
        ctx.moveTo(last_mousex,last_mousey);
        ctx.lineTo(mousex,mousey);
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
    }
    last_mousex = mousex;
    last_mousey = mousey;
    //Output
    $('#output').html('current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown);
});


//Touch interactions

//Touchstart
$(canvas).on('touchstart', function(e) {
    last_touchx = touchx = parseInt(e.clientX-canvasx);
	last_touchy = touchy = parseInt(e.clientY-canvasy);
    touchstart = true;
});

//Touchend
$(canvas).on('touchend', function(e) {
    touchstart = false;
});

//Mousemove
$(canvas).on('touchmove', function(e) {
    touchx = parseInt(e.clientX-canvasx);
    touchy = parseInt(e.clientY-canvasy);
    if(touchstart) {
        ctx.beginPath();
        if(tooltype=='draw') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = 3;
		
        } else {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 50;
        }
        ctx.moveTo(last_mousex,last_mousey);
        ctx.lineTo(touchx,touchy);
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
    }
    last_touchx = touchx;
    last_touchy = touchy;
    //Output
    $('#output').html('current: '+touchx+', '+touchy+'<br/>last: '+last_touchx+', '+last_touchy+'<br/>touchstart: '+touchstart);
});





//Use draw|erase
use_tool = function(tool) {
    tooltype = tool; //update
}

}

