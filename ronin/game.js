//////////////////////////////////////////////////////////
/*
NOTAS: 


*/
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
////////////////////////////////ini///////////////////////////
var game = function(){
	var Q = window.Q = Quintus({ audioSupported: [ 'ogg', 'mp3' ]})
		 .include("Sprites, Scenes, Input, 2D, TMX, Anim, Touch, UI, Audio")
		 // Maximize this game to whatever the size of the browser is
		 .setup({ maximize: true })
		 // And turn on default input controls and touch input (for UI)
		 .controls().touch().enableSound();

		Q.load(["hattori.png", "hattori.json","shuriken.png", "cursor.png", "cursor.json", "enemy.png", "enemy.json"], function(){
			Q.compileSheets("hattori.png", "hattori.json");
			Q.compileSheets("cursor.png", "cursor.json");
			Q.compileSheets("enemy.png", "enemy.json");
		});
		
	var originX = Q.width/2;
	var originY = Q.height/2;
	var canvas = document.getElementById('quintus');
	var center;
	
	var mousex, mousey;
	
	Q.el.addEventListener('mousemove',function(e) {
		var rect = canvas.getBoundingClientRect();
		
    	mousex = e.offsetX || e.layerX - rect.left,
        mousey = e.offsetY || e.layerY - rect.top;
    });
	
	function getMouse(evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.offsetX || evt.layerX,
			y: evt.offsetY || evt.layerY
		};
	};

	//Q.el.style.cursor='none';

	//////////////////////////////////Hattori////////////////////
	Q.Sprite.extend("Hattori", {
		init: function(){
			this._super({
				sheet: "hattori",
				sprite: "hattori anim",
				x:500,
				y:500,
				scale:0.5,
				coldown:false
			});
			this.add('2d, animation, platformerControls');
			var self=this;
			//---------------THROW SHURIKEN--------------
			document.addEventListener("click", function (evt) {
				self.fire(evt);
			});
		  },
		  
		  fire: function(evt){
			if(!this.p.coldown){
				var mouse = getMouse(evt);
				this.p.coldown = true;
				/*var dx = -this.p.w*this.p.scale-1;
				var velx = -100;
				if(this.p.direction == "right"){ dx += this.p.w*this.p.scale*2+3; velx *= -1;}*/
				var shuriken = this.stage.insert(new Q.Shuriken({x: this.p.x, y: this.p.y, objX: mouse.x, objY: mouse.y}));
				var self = this;
				console.log("Hattori "+this.p.x+" "+this.p.y);
				setTimeout(function(){self.p.coldown=false;}, 100);
			}
		  },

     	trigonometry: function (x, y){
			var cos=(x-Q.width / 2)/(Q.width/2);
			var sin=-(y-Q.height / 2)/(Q.height/2);
			
			angle=(Math.atan(sin/cos)/(Math.PI/180));
			if(cos<0)angle+=180;

			return angle;
		},
		step: function(dt){
			//console.log(this.p.x+" "+this.p.y);
			this.play("stand");
			this.p.angle = -this.trigonometry(mousex, mousey)-90;
			originX = this.p.x;
			originY = this.p.y;
		}

	});
	
	Q.animations('hattori anim', {
		stand: { frames: [0], rate: 1 }
	});
	//--------------------Enemy------------------
	Q.Sprite.extend("Enemy", {
		init: function(p){
			this._super(p, {
				sheet: "enemy",
				sprite: "enemy anim",
				x:1500,
				y:500,
				scale:0.5,
				coldown:false,
				vy:100,
				state:0,
				htt:0
			});
			this.add('2d, animation, aiBounce, tween');
			console.log(this.hattori);
			console.log("mi nombre es iñigo montoya, tu mataste a mi padre, preparate a morir");
			this.on("bump.top",function(collision) { this.p.vy=100;});
		 	this.on("bump.bottom",function(collision) {	this.p.vy=-100;});
		 	var self=this;
			document.addEventListener("click", function (evt) {
				self.fire(evt);
			});
		},
		fire: function(evt){
			this.state=!this.state;
		},
		trigonometry: function (x, y){
			var cos=(x-this.p.x)/(this.p.x);
			var sin=-(y-this.p.y)/(this.p.y);
			
			angle=(Math.atan(sin/cos)/(Math.PI/180));
			if(cos<0)angle+=180;

			return angle;
		},
		step: function(dt){
			this.play("stand");
			if(this.state==1){
				this.p.angle = -this.trigonometry(this.p.htt.p.x, this.p.htt.p.y)-90;
				this.p.vx=this.p.htt.p.x-this.p.x;
				this.p.vy=this.p.htt.p.y-this.p.y;
			}
			
		}

	});

	Q.animations('enemy anim', {
		stand: { frames: [0], rate: 1 }
	});
	//--------------------SHURIKEN---------------
	
	Q.Sprite.extend("Shuriken",{
		init:function(p){
			this._super(p,{
				asset:"shuriken.png",
				vy:500,
				vx:-500,
				sensor: true,
				objX: 0,
				objY: 0,
				scale:0.2		
			});
			
			this.add('2d, animation, tween');
			this.on("hit",this,"hit");
			console.log("shuriken "+this.p.x+" "+this.p.y);
			this.getFinal();
		},
		
		getFinal: function(){
			this.animate({x: this.p.objX, y: this.p.objY}, 1)
		},
		
		hit: function(collision){
			if(!collision.obj.isA("Hattori")){
				/*if(collision.obj.isA("Enemy")){
					collision.obj.death();
				}*/
				this.destroy();
			}
		},
		
		step:function(dt){
			//this.animate({angle: 45});
		}
	});
	
	

	/////////////////////////////cursor////////////////////
	Q.Sprite.extend("Cursor",{
		init:function(p){
			this._super(p, {
				sheet:"cursor",
				x: mousex,
				y: mousey
			});
			this.p.sensor=true;
		},
		trigonometry: function (x, y){
			var cos=(x-originX)/(originX);
			var sin=-(y-originY)/(originY);
			
			angle=(Math.atan(sin/cos)/(Math.PI/180));
			if(cos<0)angle+=180;

			return angle;
		},
		step:function(dt){
			this.p.x=mousex+center.x;
			this.p.y=mousey+center.y;
			this.p.angle=-this.trigonometry(mousex, mousey)-270;
			
		}

	});
	
	
	Q.loadTMX("mapa1.tmx",function() {
		Q.stageScene("mapa1");
		Q.debug = true;
	});


	// ## Level1 scene
		// Create a new scene called level 1
	Q.scene('mapa1', function(stage) {
		Q.stageTMX("mapa1.tmx", stage);
		center = stage.add("viewport");
		var hattori = stage.insert(new Q.Hattori());
		//var cursor = stage.insert(new Q.Cursor());
		var enemies=[];
		for(var i=0; i<46; i++){
			enemies[i]=stage.insert(new Q.Enemy({htt:hattori, x:(i+10)*100}));
		}
		center.follow(hattori, {x:true, y:true});
	});
	



}