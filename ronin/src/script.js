
///////////////////////////////ini///////////////////////////////////////
var c = oCanvas.create({
	canvas: "#canvas",
	fps: 60
});

var KEY_D=68;

var angle;

var shur=15;

var enemies= new Array();

var MAX_BADS=20;

var shurikens=new Array();

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

	enemies[random(MAX_BADS)].x+=10;
	enemies[random(MAX_BADS)].y+=10;
	enemies[random(MAX_BADS)].rotation=-random(180);

	for(var i=0;i<shurikens.length;i++){
		shurikens[i].move();
		c.addChild(shurikens[i].image)
	}


});


////////////////////////////auxiliar/////////////////////////////////
function getMouse(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
	};
}

function intersects(img1, img2){
	return (img1.x < img2.x + img2.width &&
			img1.x + img1.width > img2.x &&
			img1.y < img2.y + img2.height &&
			img1.y + img1.height > img2.y);
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

////////////////////////////shuriken/////////////////////////////////

function Shuriken(){
	this.angle=angle;
	this.image=c.display.image({
		x:c.width / 2,
		y:c.height / 2,
		width: 15,
		height: 15,
		origin: { x: "center", y: "center" },
		image: "img/shuriken.png"
	});

	this.move=function(){
		this.image.x += Math.cos(this.angle)*20;
		this.image.y += Math.sin(this.angle)*20;
	}
}

////////////////////////////events/////////////////////////////////////////

window.addEventListener('load', init, false); 


canvas.addEventListener('mousemove', function(evt) {
        var mouse = getMouse(canvas, evt);
        var angle=trigonometry(mouse.x, mouse.y);
        hattori.rotation=angle-90;        
}, false);

document.addEventListener('keydown', function (evt) {

	if(evt.which==KEY_D){
		if (shur>0){
			shur--;
			var x = hattori.x, y = hattori.y;
			shurikens.push(new Shuriken(x, y));
		}
	}
});
