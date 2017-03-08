
///////////////////////////////ini///////////////////////////////////////
var c = oCanvas.create({
	canvas: "#canvas",
	fps: 60
});
var KEY_D=68;
var angle;
var shur=1500;
var deads=new Array();
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

function randomAux(){
	var x = random(2);
	if(x==0) return -1;
	else return 1;
}

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
	
	enemies[random(MAX_BADS)].x += 5*randomAux();
	enemies[random(MAX_BADS)].y += 5*randomAux();
	enemies[random(MAX_BADS)].rotation = -45*randomAux();
	for(var i=0;i<shurikens.length;i++){
		if(shurikens[i].active){
			shurikens[i].move();
			
		}
	}
	destroyShuriken();

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
	
	angle=(Math.atan(sin/cos)/(Math.PI/180));
	if(cos<0)angle+=180;

	return angle;
}

 
function random(max) { 
	return Math.floor(Math.random() * max);
}

////////////////////////////shuriken/////////////////////////////////

function Shuriken(){
	this.angle=angle;
	this.active=true;
	this.image=c.display.image({
		x:c.width / 2,
		y:c.height / 2,
		width: 15,
		height: 15,
		origin: { x: "center", y: "center" },
		image: "img/shuriken.png"
	});
	console.log(Math.sin(90*Math.PI/180));

	this.move=function(){
		this.image.x += Math.cos(this.angle*Math.PI/180)*20;
		this.image.y -= Math.sin(this.angle*Math.PI/180)*10;
		
		if (this.image.x > canvas.width+this.width) this.active=false;
		if (this.image.y > canvas.height+this.height) this.active=false;
		if (this.image.x < 0-this.width) this.active=false;
		if (this.image.y < 0-this.height) this.active=false;
	
	}
}

function destroyShuriken(){
	for(var i=0;i<shurikens.length;i++){
		if(!shurikens[i].active){
			shurikens.splice(i,1);
			i--;
		}
	}
}

////////////////////////////events/////////////////////////////////////////

window.addEventListener('load', init, false); 


canvas.addEventListener('mousemove', function(evt) {
        var mouse = getMouse(canvas, evt);
        var angle=trigonometry(mouse.x, mouse.y);
        hattori.rotation=-angle-90;        
}, false);

document.addEventListener('keyup', function (evt) {

	if(evt.which==KEY_D){
		if (shur>0){
			shur--;
			var x = hattori.x, y = hattori.y;
			shurikens.push(new Shuriken(x, y));
			c.addChild(shurikens[shurikens.length-1].image);
		}
	}
});
