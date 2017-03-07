
window.addEventListener('load', start, false); 

var Ronin=Ronin || {};

var r;

function start(){
	r=new Ronin();

	r.init();
}

canvas.addEventListener('mousemove', function(evt) {
        var mouse = getMouse(canvas, evt);
        r.rotate(mouse);
}, false);

function getMouse(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
	};
}

Ronin = function(){

	this.samurai=new HattoriHanzo();
	this.enemies=new Array();
	this.s=new Image();
	this.canvas;
	this.ctx;
	this.x;
	this.y;
	this.init=function(){

		this.s.src='img/yasuo.svg';
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.x=this.canvas.width/2;
		this.y=this.canvas.height/2;
		this.ctx.drawImage(this.s, this.canvas.width/2, this.canvas.height/2,100,50);
		
	};

	this.trigonometry=function(x, y){
		return Math.asin(y/Math.sqrt(x*x+y*y));
	};
	this.rotate=function(mouse){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.save();

		var angle=this.trigonometry(mouse.x, mouse.y);
		
		this.ctx.rotate(angle);
    	
    	this.ctx.drawImage(this.s, this.x, this.y,100,50);

    	this.ctx.restore();

		console.log(angle+" "+mouse.x+" "+mouse.y);
	};
	
	
};


HattoriHanzo = function(){
	
	this.draw = function(){

	};


};

