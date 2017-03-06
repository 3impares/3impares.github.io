
 window.addEventListener('load', start, false); 

var Ronin=Ronin || {};


function start(){
	var r=new Ronin();

	r.init();
}

Ronin = function(){

	this.samurai=new HattoriHanzo();
	this.enemies=new Array();
	this.s=new Image();
	this.canvas;
	this.ctx;
	

	this.init=function(){

		this.s.src='img/yasuo.svg';
		this.canvas = document.getElementById('canvas');
		this.ctx = canvas.getContext('2d');

		this.loop();
	};
	
	this.draw=function(){
	
		this.ctx.drawImage(this.s, canvas.width/2, canvas.height/2,100,50);
	
	};
	
	this.loop=function(){
		window.requestAnimationFrame(this.loop());
		this.draw();
		/*var self=this;
	
		var interval=setInterval(function(){
			self.draw();
		}, 20);
	*/
	};
	
	
};



HattoriHanzo = function(){
	
	this.draw = function(){

	};


};

/*

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
	};
}

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

canvas.addEventListener('mousemove', function(evt) {
	var mousePos = getMousePos(canvas, evt);
}, false);

function drawRotated(degrees){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(degrees*Math.PI/180);
    ctx.drawImage(image,-image.width/2,-image.width/2);
    ctx.restore();
    ctx.fillStyle = '#ff0';
    ctx.fillRect(70, 70, 50, 10, 2);
}

*/