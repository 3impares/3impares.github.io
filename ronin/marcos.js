var angle;
var c = oCanvas.create({
	canvas: "#canvas"
});

var image=c.display.image({
	x:c.width / 2,
	y:c.height / 2,
	width: 100,
	height: 50,
	origin: { x: "center", y: "center" },
	image: "img/yasuo.svg"
});

c.setLoop(function () {});

c.addChild(image);

c.timeline.start();

canvas.addEventListener('mousemove', function(evt) {
        var mouse = getMouse(canvas, evt);
        var angle=trigonometry(mouse.x, mouse.y);
        image.rotation=angle-90;        
}, false);

function getMouse(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
	};
}

function trigonometry(x, y){
	var cos=(x-c.width / 2)/(c.width/2);
	var sin=-(y-c.height / 2)/(c.height/2);
	
	angle=-(Math.atan(sin/cos)/(Math.PI/180));
	if(cos<0)angle+=180;

	return angle;
}
