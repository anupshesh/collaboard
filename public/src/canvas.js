window.onload = function() // to load an app on opening the page (HTML)
{

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var colorInput = document.getElementById("color");


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
  var color = 'black';
  //Establishing server-socket-client connection
  var socket = io.connect(':3000');


//Color listener
          colorInput.addEventListener('input',()=>{
            color = colorInput.value;
            ctx.strokeStyle = color;
          });


        //Touch interactions : src http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
        // Set up touch events for mobile, etc
        canvas.addEventListener("touchstart", function (e) {
          var touch = e.touches[0];
          e.preventDefault();
          var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
            });
          canvas.dispatchEvent(mouseEvent);
        }, false);

        canvas.addEventListener("touchend", function (e) {
          e.preventDefault();
          var mouseEvent = new MouseEvent("mouseup", {});
          canvas.dispatchEvent(mouseEvent);
        }, false);

        canvas.addEventListener("touchmove", function (e) {
          var touch = e.touches[0];
          e.preventDefault();
          var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          canvas.dispatchEvent(mouseEvent);
        }, false);                


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

        //SENDING DATA TO SERVER
        $(canvas).on('mousemove', function(e) {
           if(mousedown) {
              console.log('Sending: ' + e.clientX + ',' + e.clientY + ',' + tooltype + ',' + mousedown + ',' + ctx.strokeStyle + ',' + mousex + ',' +last_mousex);

              var data = {
                x: e.clientX,
                y: e.clientY,
                useTool: tooltype,
                useMouse: mousedown,
                pencolor: ctx.strokeStyle
                }
              socket.emit('drawing',data);
            }
        });

    //RECEIVING DATA FROM SERVER    
    socket.on('mouse',newDrawing);
    function newDrawing(data){
      ctx.strokeStyle = data.pencolor;
      var lst_mousex;
      var lst_mousey;
      var msx;
      var msy;

      lst_mousex = msx = parseInt(data.x-canvasx);
      lst_mousey = msy = parseInt(data.y-canvasy);
      var use_tool = data.useTool;
      var msdown = data.useMouse;
      console.log('Received: ' + data.x + ',' + data.y + ',' + use_tool + ',' + msdown + ',' + ctx.strokeStyle)

            if(msdown) {
              msx = parseInt(data.x-canvasx);
              msy = parseInt(data.y-canvasy);

                ctx.beginPath();
                if(use_tool=='draw') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.lineWidth = 3;
                } else {
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineWidth = 50;
                }
              ctx.moveTo(lst_mousex,lst_mousey);
              ctx.lineTo(msx,msy);
              ctx.lineJoin = ctx.lineCap = 'round';
              ctx.stroke();

            lst_mousex = msx;
            lst_mousey = msy;

            }
            

            //Output
            $('#output').html('current: '+msx+', '+msy+'<br/>last: '+lst_mousex+', '+lst_mousey+'<br/>mousedown: '+msdown);
        //});  

    }

        
  //Use draw|erase
    use_tool = function(tool) {
    tooltype = tool; 
    }
  
}