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

		Q.load(["hattori.png", "hattori.json","shuriken.png", "cursor.png", "cursor.json"], function(){
			Q.compileSheets("hattori.png", "hattori.json");
			Q.compileSheets("cursor.png", "cursor.json");
		});
		
	var originX = Q.width/2;
	var originY = Q.height/2;
	var canvas = document.getElementById('quintus'); 
	
	var mousex, mousey;
	
	Q.el.addEventListener('mousemove',function(e) {
		var rect = canvas.getBoundingClientRect();
		
    	mousex = e.offsetX || e.layerX - rect.left,
        mousey = e.offsetY || e.layerY - rect.top;
    });	

	Q.el.style.cursor='none';

	//////////////////////////////////Hattori////////////////////
	Q.Sprite.extend("Hattori", {
		init: function(){
			this._super({
				sheet: "hattori",
				sprite: "hattori anim",
				x:Q.width/2,
				y:Q.height/2,
				scale:0.5,
				coldown:false
			});
			this.add('2d, animation, platformerControls');
			var self=this;
			//---------------THROW SHURIKEN--------------
			document.addEventListener("keydown", function (evt) {
				if(evt.which==67){ //C
					self.fire();
				}	
			});
		  },
		  
		  fire: function(){
			if(!this.p.coldown){
				
				this.p.coldown = true;
				var dx = -this.p.w*this.p.scale-1;
				var velx = -100;
				//if(this.p.direction == "right"){ dx += this.p.w*this.p.scale*2+3; velx *= -1;}
				var shuriken = this.stage.insert(new Q.Shuriken({x: this.p.x+dx, y: this.p.y}));
				var self = this;
				console.log("Hattori "+this.p.x+" "+this.p.y);
				setTimeout(function(){self.p.coldown=false;}, 1000);
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
			this.play("stand");
			this.p.angle = -this.trigonometry(mousex, mousey)-90;
			originX = this.p.x;
			originY = this.p.y;
		}

	});
	
	Q.animations('hattori anim', {
		stand: { frames: [0], rate: 1 }
	});
	
	//--------------------SHURIKEN---------------
	
	Q.Sprite.extend("Shuriken",{
		init:function(p){
			this._super(p,{
				asset:"shuriken.png",
				vy:500,
				vx:-500,
				scale:0.2			
			});
			
			this.add('2d, animation, tween');
			this.on("hit",this,"hit");
			console.log("shuriken "+this.p.x+" "+this.p.y);
		},
		hit:function(){
			this.destroy();
		},
		
		step:function(dt){}
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
			//this.add("2d, platformerControls");
		},
		trigonometry: function (x, y){
			var cos=(x-originX)/(originX);
			var sin=-(y-originY)/(originY);
			
			angle=(Math.atan(sin/cos)/(Math.PI/180));
			if(cos<0)angle+=180;

			return angle;
		},
		step:function(dt){
			this.p.x=mousex;
			this.p.y=mousey;
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
		console.log("hola");
		var hattori = stage.insert(new Q.Hattori());
		var cursor = stage.insert(new Q.Cursor());
		stage.add("viewport").follow(hattori, {x:true, y:true});
	});
	



}