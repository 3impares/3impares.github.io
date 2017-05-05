
//accedemos a las posiciones de la matriz de la siguiente manera:
//			  level [i*w+j]; //i filas, j columnas
//console.log(level1[98*100+1]); 

///////////////////////////////ini///////////////////////////////////////
var c = oCanvas.create({
	canvas: "#canvas",
	fps: 60
});


var KEY_D=68;
var angle;
var shur=15;
var deads=new Array();
var enemies= new Array();
var MAX_BADS=20;
var shurikens=new Array();
var score=0;
var ctx=null;
var scoreboard = c.display.text({
	x: 100,
	y: 50,
	origin: { x: "center", y: "center" },
	font: "bold 30px sans-serif",
	text: "Score: "+score+"\nShurikens: "+shur,
	fill: "#000"
});
c.addChild(scoreboard);

var hattori=c.display.image({
	x:c.width / 2,
	y:c.height / 2,
	width: 100,
	height: 50,
	origin: { x: "center", y: "center" },
	image: "img/game/yasuo.svg"
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
				image: "img/game/enemy.svg"
			  });
		c.addChild(enemies[i]);
	}

	
}

c.setLoop(function () {
	
	scoreboard.text = "Score: "+score+"\nShurikens: "+shur;
	
	//enemies[random(MAX_BADS)].x += 5*randomAux();
	//enemies[random(MAX_BADS)].y += 5*randomAux();
	//enemies[random(MAX_BADS)].rotation = -45*randomAux();

	for(var i=0;i<shurikens.length;i++){
		if(shurikens[i].active){
			shurikens[i].move();
		}
	}
	
	for(var j=0; j<enemies.length; j++){
		for(var k=0;k<shurikens.length; k++){
			if(intersects(shurikens[k].image, enemies[j])){
				kill(j);
				shurikens[k].image.image = null;
				shurikens[k].active = false;
			}
		}
	}
	destroyShuriken(); //eliminar shurikens inactivos
	//setTimeout(function(){deads.splice(deads.length-1,1);}, 100); //eliminar muertos
	if(keys['space']){
		keys['space']=false;
		throwShuriken();
	}

});

function kill(i){
	score += 10;
	shur++;
	deads.push(c.display.image({
				x:enemies[i].x,
				y:enemies[i].y,
				width: 100,
				height: 50,
				origin: { x: "center", y: "center" },
				image: "img/game/muerto.png"
			  }));
	c.addChild(deads[deads.length-1]);
	enemies[i].x = random(canvas.width / 50 - 1) * 50;
	enemies[i].y = random(canvas.height / 50 - 1) * 50;
}

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
		image: "img/game/shuriken.png"
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

function throwShuriken(){
	if (shur>0){
		shur--;
		var x = hattori.x, y = hattori.y;
		shurikens.push(new Shuriken(x, y));
		c.addChild(shurikens[shurikens.length-1].image);
	}
}

////////////////////////////events/////////////////////////////////////////

window.addEventListener('load', init, false); 


canvas.addEventListener('mousemove', function(evt) {
        var mouse = getMouse(canvas, evt);
        var angle=trigonometry(mouse.x, mouse.y);
        hattori.rotation=-angle-90;        
}, false);

var KEY_CODES = { 32:'space', 37: 'left', 39: 'right', 38:'up', 40:'down'};
var keys = {};

window.addEventListener('keydown',function(e) {
  if(KEY_CODES[e.keyCode]) {
   keys[KEY_CODES[e.keyCode]] = true;
   e.preventDefault();
  }
},false);

window.addEventListener('keyup',function(e) {
  if(KEY_CODES[e.keyCode]) {
   keys[KEY_CODES[e.keyCode]] = false; 
   e.preventDefault();
  }
},false);
