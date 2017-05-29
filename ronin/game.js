//////////////////////////////////////////////////////////
/*
NOTAS: 

http://gaia.fdi.ucm.es/files/people/pedro/slides/dvi/04canvas.html

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

	Q.debug = true;
	Q.load(["katana.png", "katana.json", "htt.png", "htt.json","cono.png","hattori.png", "hattori.json","shuriken.png", "cursor.png", "cursor.json", "enemy.png", "enemy.json"], function(){
		Q.compileSheets("hattori.png", "hattori.json");
		Q.compileSheets("htt.png", "htt.json");
		Q.compileSheets("cursor.png", "cursor.json");
		Q.compileSheets("enemy.png", "enemy.json");
		Q.compileSheets("katana.png", "katana.json");
	});

	Q.animations("hattori_anim", {
		attack: { frames: [1,2,3,4,6,7,8,9,10,11,12,13], rate: 1/30, flip: false, loop:false, next:"stand", trigger: "attackFin"}, 
		stand: { frames: [0], rate: 1/10, flip:false}
	});
		
		
	var originX = Q.width/2;
	var originY = Q.height/2;
	var canvas = document.getElementById('quintus');
	var center;
	
	var mousex=0, mousey=0;
	var hattori;
	
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

	//////////////////////////////////Hattori////////////////////////////////////////////////////////////////////////////////////////////
	Q.Sprite.extend("Hattori", {
		init: function(){
			this._super({
				sheet: "hattori",
				sprite: "hattori_anim",
				x:500,
				y:500,
				scale:0.5,
				coldown:false,
				attackType: true,	//false = shuriken, true = sword
				changing: false,
				katana: 0,
				first:true
			});
			
			this.add('2d, animation, platformerControls');
			this.on("hit", "kill");
			this.on("attackFin", this, "attackFin");
			this.on("swordAttack", this, "swordAttack");
			this.on("shurikenAttack", this, "shurikenAttack");
			this.on("clickEvent", this, "fire");
			//console.log("pudiera llegar el día, en el que una horda de lobos y escudos rotos rubricaran la edad de los hombres, pero hoy, no es ese día");			
			this.play("stand");
			
		},
		  
		swordAttack: function(){
			this.p.attackType = true;
		},
		  
		shurikenAttack: function(){
			this.p.attackType = false;
		},
		
		fire: function(evt){
			var self = this;
			if(this.p.attackType){ //sword attack
				this.p.attacking = true;
				this.p.katana.animate({angle: 180 });

			}else{	//shuriken attack
				if(!this.p.coldown){
					var mouse = getMouse(evt);
					this.p.coldown = true;
					/*var dx = -this.p.w*this.p.scale-1;
					var velx = -100;
					if(this.p.direction == "right"){ dx += this.p.w*this.p.scale*2+3; velx *= -1;}*/
					var shuriken = this.stage.insert(new Q.Shuriken({x: this.p.x, y: this.p.y, dir:this.p.dir}));
					var self = this;
					//console.log("Hattori "+this.p.x+" "+this.p.y);
					setTimeout(function(){self.p.coldown=false;}, 100);
				}
			}
		
		},
		
		attackFin: function(){
			this.p.attacking = false;
		},
		
		kill: function(collision){
			if(this.p.attacking){	
				if(collision.obj.isA("Enemy")){
					collision.obj.die();
				}
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
			if(this.p.first){
				this.p.katana = this.stage.insert(new Q.Katana({x: this.p.x, y: this.p.y, dir:this.p.dir}));
				this.p.first=!this.p.first;
			}
			//console.log(this.p.x+" "+this.p.y);
			this.p.dir = this.trigonometry(mousex, mousey);
			this.p.angle=-this.p.dir-90;
			//this.c.angle = -this.trigonometry(mousex, mousey)-90;
			originX = this.p.x;
			originY = this.p.y;
			
			this.p.katana.p.angle = this.p.angle + 180;
			//this.p.katana.p.x = this.p.x - this.p.w/4;
			//this.p.katana.p.y = this.p.y - this.p.h/4;
			
			this.p.katana.p.x = this.p.x + (this.p.w/4 * Math.sin(this.p.dir*Math.PI/180));
			this.p.katana.p.y = this.p.y + (this.p.h/2 * Math.cos(this.p.dir*Math.PI/180));
			
		}

	});
	
	//--------------------Enemy------------------------------------------------------------------
	Q.Sprite.extend("Enemy", {
		init: function(p){
			this._super(p, {
				sheet: "enemy",
				sprite: "enemy anim",
				x:1500,
				y:500,
				scale:0.5,
				dir:270,
				coldown:false,
				time:0,
				patrolTime:4000,
				patrol:100,
				vel:300,
				state:0,
				cono: 0
			});
			this.add('2d, animation, tween');
			//console.log("mi nombre es iñigo montoya, tu mataste a mi padre, preparate a morir");
			this.on("bump.top, bump.bottom","wally");
		 	this.on("bump.right, bump.left","wallx");
		 	
		 	var self=this;
			document.addEventListener("dblclick", function (evt) {
				self.fire(evt);
			});
		},
		
		wallx:function(){
			if(this.p.state==0){
				this.p.dir=(this.p.dir+90)%360;
			}
		},
		
		wally:function(){
			if(this.p.state==0){
				this.p.dir=-this.p.dir;
			}
		},
		
		die: function(){
			this.p.cono.destroy();
			this.destroy();
		},
		fire: function(evt){
			if(this.p.state==0)
				this.p.state=1;
			else 
				this.p.state=0;
		},
		trigonometry: function (x, y){
			var cos=(x-this.p.x)/(this.p.x);
			var sin=-(y-this.p.y)/(this.p.y);
			
			angle=(Math.atan(sin/cos)/(Math.PI/180));
			if(cos<0)
				angle+=180;

			return angle;
		},
		step: function(dt){
			this.play("stand");
			this.p.angle=-this.p.dir-90;
			var v;
			if(this.p.state==1){
				this.p.dir = this.trigonometry(hattori.p.x, hattori.p.y);
				v=this.p.vel;
			}
			else{
				this.p.time+=dt*1000;
				if(this.p.time>=this.p.patrolTime){
					this.p.dir+=180;
					this.p.time=0;
				}
				v=this.p.patrol;
			}
			this.p.vy=-v*Math.sin(this.p.dir*Math.PI/180);
			this.p.vx=v*Math.cos(this.p.dir*Math.PI/180);
			if(this.p.cono.p.alert){
				this.p.state = 1;
				this.p.cono.p.alert=false;
				}
			this.p.cono.p.angle=this.p.angle;
			
			this.p.cono.p.x=this.p.x+(this.p.h*this.p.scale/2+this.p.cono.p.h*this.p.cono.p.scale/2)*Math.cos(this.p.dir*Math.PI/180);
			this.p.cono.p.y=this.p.y-(this.p.h*this.p.scale/2+this.p.cono.p.h*this.p.cono.p.scale/2)*Math.sin(this.p.dir*Math.PI/180);
			
		}

	});

	Q.animations('enemy anim', {
		stand: { frames: [0], rate: 1 }
	});

	//--------------------SHURIKEN---------------
	
	Q.Sprite.extend("Shuriken",{
		init:function(p){
			this._super(p,{
				dir:0,
				asset:"shuriken.png",
				vy:0,
				vx:0,
				sensor: true,
				scale:0.2
				
			});
			this.p.vy=-Q.height*Math.sin(this.p.dir*(Math.PI/180));
			this.p.vx=Q.width*Math.cos(this.p.dir*(Math.PI/180));
			this.p.y+=-30*Math.sin(this.p.dir*(Math.PI/180));
			this.p.x+=30*Math.cos(this.p.dir*(Math.PI/180));
			
			this.add('2d, animation, tween');
			this.on("hit",this,"hit");
			//this.getFinal();
		},
		
		getFinal: function(){
			this.animate({x: this.p.objX, y: this.p.objY}, 1)
		},
		
		hit: function(collision){
			if(!collision.obj.isA("Hattori")){
				
				if(collision.obj.isA("Enemy")){
					collision.obj.die();
				}
				if(!collision.obj.isA("Cono"))
					this.destroy();
			}
		},
		
		step:function(dt){
			
			//this.animate({angle: 45});
		}
	});
	
	////////////////////////////Katana//////////////////////
	Q.Sprite.extend("Katana",{
		init:function(p){
			this._super(p,{
				dir:0,
				asset:"katana.png",
				sensor: true,
				scale:0.1,
				cy: 0,
				cx: 0
			});
			this.p.h=this.p.h*2;
			this.add('2animation, tween');
			this.size(true);
			//this.on("hit",this,"hit");
		},
		hit: function(collision){
			if(!collision.obj.isA("Hattori")){
				if(collision.obj.isA("Enemy")){
					collision.obj.die();
				}
			}
		},
		step:function(){
			
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
			//this.p.sensor=true;
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
	
	/////////////////////////////---CONO---////////////////////
	Q.Sprite.extend("Cono",{
		init:function(p){
			this._super(p, {
				asset:"cono.png",
				x: 500,
				y: 800,
				opacity: 0.5,
				alert: false,
				scale:0.7
			});
			this.p.sensor=true;
			this.on("hit", this, "hit");
		},
		
		hit: function(collision){
			if(collision.obj.isA("Hattori")){
				this.p.alert = true;
				//this.destroy();
			}
		},	
		step:function(dt){
			//console.log(this.p.x+" "+this.p.y);
		}
	});
	



	Q.loadTMX("mapa1.tmx",function() {
		Q.stageScene("mapa1");
		//Q.debug = true;
	});


	// ## Level1 scene
		// Create a new scene called level 1
	Q.scene('mapa1', function(stage) {
		Q.stageTMX("mapa1.tmx", stage);
		center = stage.add("viewport");
		hattori = stage.insert(new Q.Hattori());
		
		/*var enemies=[];
		for(var i=0; i<46; i++){
			var cn=stage.insert(new Q.Cono({x:(i+10)*100, y:600}));
			enemies[i]=stage.insert(new Q.Enemy({htt:hattori, x:(i+10)*100, cono: cn}));

		}*/
		var cn=stage.insert(new Q.Cono({ y:600}));
		var enemy=stage.insert(new Q.Enemy({cono:cn}));


		center.follow(hattori, {x:true, y:true});
	});

}
