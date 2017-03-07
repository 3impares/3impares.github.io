
///////////////////////////////ini///////////////////////////////////////
var c = oCanvas.create({
	canvas: "#canvas",
	fps: 60
});

var angle;

var enemies= new Array();

var MAX_BADS=20;


var hattori=c.display.image({
	x:c.width / 2,
	y:c.height / 2,
	width: 100,
	height: 50,
	origin: { x: "center", y: "center" },
	image: "img/yasuo.svg"
});


c.addChild(hattori);

c.timeline.start();

//////////////////////////////game/////////////////////////////////////////

function init(){
	
	for(var i=0;i<MAX_BADS;i++){
		enemies[i]=c.display.image({
				x:random(c.width-100)+50,
				y:random(c.height-50)+25,
				width: 100,
				height: 50,
				origin: { x: "center", y: "center" },
				image: "img/enemy.svg"
			  });
		c.addChild(enemies[i]);
	}

	
}

c.setLoop(function () {
	enemies[random(MAX_BADS)].x+=5;
	enemies[random(MAX_BADS)].y+=5;
	enemies[random(MAX_BADS)].rotation=-45;

});


////////////////////////////auxiliar/////////////////////////////////
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

 
function random(max) { 
	return Math.floor(Math.random() * max);
}


////////////////////////////events/////////////////////////////////////////

window.addEventListener('load', init, false); 


canvas.addEventListener('mousemove', function(evt) {
        var mouse = getMouse(canvas, evt);
        var angle=trigonometry(mouse.x, mouse.y);
        hattori.rotation=angle-90;        
}, false);


