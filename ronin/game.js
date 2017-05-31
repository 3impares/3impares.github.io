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

	//Q.debug = true;
	Q.debug = false;


		 
	var maxHealth = 100;
	var maxShurikens = 20;

	Q.state.set({
		health: maxHealth,
		shurikens:maxShurikens,
		weapon:"leonard-katana.png",
		state: 0
	});
	Q.state.on("change.health, change.shurikens, change.weapon, change.state", function(){
			Q.stageScene("HUD", 1, 
				{label: "Health " + Q.state.get("health") + "Shurikens "+ Q.state.get("shurikens")});
				});



	Q.load(["katana.png", "katana.json", "htt.png", "htt.json", "cono_grande.png", "cono.png", "hattori.png",
				 "hattori.json", "shuriken.png", "cursor.png", "cursor.json", "enemy.png", "enemy.json",
				 "shuriken_sym.png", "shuriken_sym.json", "katana_sym.png", "katana_sym.json", "shurikenEnemy.png",
				 "health-potion.png", "bag.png", "kumo-jailed.png", "calm.png", "alert.png", "leonard-katana.png",
				 "sh.png"], function(){
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


	////////////////////////////////////////////////////////////////////
	//////////////////////      HATTORI       //////////////////////////
	////////////////////////////////////////////////////////////////////
	
	Q.Sprite.extend("Hattori", {
		init: function(p){
			this._super(p, {
				sheet: "hattori",
				sprite: "hattori_anim",
				x:500,
				y:500,
				scale:0.5,
				coldownAttack: 50,
				attackType: true,	//false = shuriken, true = sword
				changing: false,
				katana: 0,
				first:true,
				coldRoll:0,
				shurikens:20,
				health: 100,
				enemies: 0
		});
			var kat = this.p.katana;
			
			this.add('2d, animation, platformerControls, tween');
			this.on("attackFin", this, "attackFin");
			this.on("swordAttack", this, "swordAttack");
			this.on("shurikenAttack", this, "shurikenAttack");
			this.on("clickEvent", this, "fire");
			this.on("roll", this, "roll");
			this.play("stand");
			
			Q.state.set({health: maxHealth, shurikens: maxShurikens});
			Q.state.set("weapon", "leonard-katana.png");
			Q.state.set("state", 0);
		},
		  
		swordAttack: function(){
			Q.state.set("weapon", "leonard-katana.png");
			this.p.attackType = true;
		},
		  
		shurikenAttack: function(){

			//if(this.p.attackType){
				this.p.attackType = false;
				Q.state.set("weapon", "sh.png");
			/*}else{
				this.p.attackType = true;
				Q.state.set("weapon", "katana_sym.png");
			}*/

		},
		
		roll: function(){
			if(this.p.coldRoll==0){
				this.p.coldRoll=50;
				this.animate({speed:800}, 0.2, {callback: function(){this.p.speed=400}});
			}
		},
		
		fire: function(evt){
			var self = this;
			var kat = this.kat.p;
			if(this.p.attackType){ //sword attack
				if(this.p.coldownAttack==0){
					this.p.coldownAttack=50;
					kat.attacking = true;
					this.kat.animate({angle: kat.angle+60}, 0.1, Q.Easing.Quadratic.In)
					
					.chain({x: (this.p.x - ((this.p.w/4+kat.w*kat.scale/2) * Math.sin(this.p.dir*Math.PI/180)))+(70)*(Math.cos(this.p.dir*Math.PI/180)),
							y: (this.p.y - ((this.p.h/2+kat.w*kat.scale/2) * Math.cos(this.p.dir*Math.PI/180)))-(70)*(Math.sin(this.p.dir*Math.PI/180)), 
							angle: kat.angle+100}, 0.1, Q.Easing.Linear)
					
					.chain({x: (this.p.x - ((this.p.w/4+kat.w*kat.scale/2) * Math.sin(this.p.dir*Math.PI/180)))+(150)*(Math.sin(this.p.dir*Math.PI/180))+(70)*(Math.cos(this.p.dir*Math.PI/180)),
							y: (this.p.y - ((this.p.h/2+kat.w*kat.scale/2) * Math.cos(this.p.dir*Math.PI/180)))-(70)*(Math.sin(this.p.dir*Math.PI/180))+(150)*(Math.cos(this.p.dir*Math.PI/180)), 
							angle: kat.angle+240}, 0.1, Q.Easing.Linear)
					
					.chain({x: (this.p.x - ((this.p.w/4+kat.w*kat.scale/2) * Math.sin(this.p.dir*Math.PI/180))), 
							y: (this.p.y - ((this.p.h/2+kat.w*kat.scale/2) * Math.cos(this.p.dir*Math.PI/180))), 
							angle: kat.angle}, 0.3, Q.Easing.Quadratic.Out, 
							{ callback: function() { console.log("fin "); kat.attacking = false; kat.finAttack = false;} });
				}
			}else{	//shuriken attack
				if(this.p.coldownAttack==0 && Q.state.get("shurikens")>0){
					this.p.coldownAttack = 50;
					var mouse = getMouse(evt);
					
					var shuriken = this.stage.insert(new Q.Shuriken({x: this.p.x, y: this.p.y, dir:this.p.dir, shooter: this.className}));
					
					Q.state.inc("shurikens", -1);
				}
			}
		
		},
		
		hurt: function(){
			Q.state.inc("health", -10);
			if(Q.state.get("health") <= 0){
				this.die();
			}
		},
		
		die: function(){
			this.destroy();
			this.kat.destroy();
			//aparece scene de fin de juego
			Q.stageScene("endGame", 2, {label: "Hattori dies. Try again!"});
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
				this.kat = this.stage.insert(new Q.Katana({x: this.p.x, y: this.p.y, dir:this.p.dir}));
				this.p.first=!this.p.first;
			}
			if(this.kat.p.attacking){
				this.kat.p.opacity = 1;
			}else{
				this.kat.p.opacity = 0;
			}
			
			this.p.dir = this.trigonometry(mousex, mousey);
			this.p.angle=-this.p.dir-90;
			originX = this.p.x;
			originY = this.p.y;

			if(this.p.coldRoll){
				this.p.coldRoll--;
			}
	
			if(this.p.coldownAttack){
				this.p.coldownAttack--;
			}
	
			this.kat.p.angle = this.p.angle;
			
			this.kat.p.x = this.p.x - ((this.p.w/4+this.kat.p.w*this.kat.p.scale/2) * Math.sin(this.p.dir*Math.PI/180));
			this.kat.p.y = this.p.y - ((this.p.h/2+this.kat.p.w*this.kat.p.scale/2) * Math.cos(this.p.dir*Math.PI/180));
			console.log(this.p.enemies);		
		}


	});
	
	
	////////////////////////////////////////////////////////////////////
	///////////////////////      ENEMY       ///////////////////////////
	////////////////////////////////////////////////////////////////////
	
	Q.Sprite.extend("Enemy", {
		init: function(p){
			this._super(p, {
				sheet: "enemy",
				sprite: "enemy anim",
				x:1500,
				y:500,
				scale:0.5,
				dir:-90,
				time:0,
				patrolTime:8000,
				patrol:100,
				v:0,
				turning:false,
				vel:300,
				state:0,
				cono: 0,
				first:true,
				coldownAttack: 100,
				health: 30,
				attackType: false	//true: meele; false: shooter
			});
			this.add('2d, animation, tween');
			this.on("bump.top, bump.bottom", "collisiony");
		 	this.on("bump.right, bump.left", "collisionx");
		 	
		},
		
		collisionx:function(collision){
			if(this.p.state==0){
				if(collision.obj.isA("Hattori"))
					this.p.state=1;
				else{
					var newDir=(this.p.dir+90)%360;
					if(newDir-this.p.dir>180)
						newDir=-newDir;
					this.turn(newDir,0.5);
				}
			}
		},
		
		collisiony:function(collision){
			if(this.p.state==0){
				if(collision.obj.isA("Hattori"))
					this.p.state=1;
				else{
					var newDir=-this.p.dir;
				//	if(newDir-this.p.dir<180)
					//	newDir=360-newDir;
					this.turn(newDir,0.5);
				}
			}
		},
		
		turn:function(angle,time){
			if(!this.p.turning){
				var self=this;
				this.p.v=0;
				this.p.turning=true;
				this.animate({dir: angle }, time, Q.Easing.Linear,{callback: function() {self.p.v = self.p.patrol;this.p.turning=false;} });
				this.p.time=0;
			}
		},
		
		fire: function(){
			/*var self = this;
			var kat = this.kat.p;
			if(this.p.attackType){ //sword attack
				if(this.p.coldownAttack==0){
					this.p.coldownAttack=50;
					kat.attacking = true;
					this.kat.animate({angle: kat.angle+60}, 0.1, Q.Easing.Quadratic.In)
					
					.chain({x: (this.p.x - ((this.p.w/4+kat.w*kat.scale/2) * Math.sin(this.p.dir*Math.PI/180)))+(70)*(Math.cos(this.p.dir*Math.PI/180)),
							y: (this.p.y - ((this.p.h/2+kat.w*kat.scale/2) * Math.cos(this.p.dir*Math.PI/180)))-(70)*(Math.sin(this.p.dir*Math.PI/180)), 
							angle: kat.angle+100}, 0.1, Q.Easing.Linear)
					
					.chain({x: (this.p.x - ((this.p.w/4+kat.w*kat.scale/2) * Math.sin(this.p.dir*Math.PI/180)))+(150)*(Math.sin(this.p.dir*Math.PI/180))+(70)*(Math.cos(this.p.dir*Math.PI/180)),
							y: (this.p.y - ((this.p.h/2+kat.w*kat.scale/2) * Math.cos(this.p.dir*Math.PI/180)))-(70)*(Math.sin(this.p.dir*Math.PI/180))+(150)*(Math.cos(this.p.dir*Math.PI/180)), 
							angle: kat.angle+240}, 0.1, Q.Easing.Linear)
					
					.chain({x: (this.p.x - ((this.p.w/4+kat.w*kat.scale/2) * Math.sin(this.p.dir*Math.PI/180))), 
							y: (this.p.y - ((this.p.h/2+kat.w*kat.scale/2) * Math.cos(this.p.dir*Math.PI/180))), 
							angle: kat.angle}, 0.3, Q.Easing.Quadratic.Out, 
							{ callback: function() { console.log("fin "); kat.attacking = false;} });
				}
			}else{*/	//shuriken attack
				if(this.p.coldownAttack==0 /*&& this.p.shurikens>0*/){
					this.p.coldownAttack=100;
					console.log("enemy attack you");
					var shuriken = this.stage.insert(new Q.Shuriken({x: this.p.x, y: this.p.y, dir:this.p.dir, shooter: this.className, asset: "shurikenEnemy.png"}));
					
				}
			//}
		
		},
		
		hurt: function(){
			this.p.health -= 10;
			if(this.p.health <= 0){
				this.die();
			}
		},
		
		die: function(){
			this.p.cono.destroy();
			this.destroy();
			if(this.p.state==1){
				hattori.p.enemies--;
				Q.state.set("state", hattori.p.enemies);
			}
		},

		trigonometry: function (x, y){
			var cos = (x-this.p.x)/(this.p.x);
			var sin=-(y-this.p.y)/(this.p.y);
			
			angle = (Math.atan(sin/cos)/(Math.PI/180));
			if(cos<0)
				angle+=180;

			return angle;
		},
		
		distance: function(){
			var x=this.p.x-hattori.p.x;
			console.log("x: "+x);
			var y=this.p.y-hattori.p.y;
			console.log("y: "+y);
			
			return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
		},
		

		step: function(dt){
			if(this.p.first){
				this.p.cono = this.stage.insert(new Q.Cono());
				this.p.first=false;
			}
			this.play("stand");
			this.p.angle = -this.p.dir-90;

			if(this.p.state == 1){ //alert mode
				this.p.dir = this.trigonometry(hattori.p.x, hattori.p.y);
				console.log(this.distance())
				if(this.distance()<500){
					this.p.v=0;
					console.log("al lado")
				}
				else{
					console.log("lejos")
					this.p.v = this.p.vel;
					}
								
				if(this.p.coldownAttack){		//los tiradores disparan cada cierto tiempo si te persiguen.
					this.p.coldownAttack --;		//los meeles atacaran si estás en su cono de visión.
				}else{
					this.fire();
				}
				this.p.cono.p.opacity = 0.1;
			}
			else if(!this.p.turning){		//patrol mode
				this.p.cono.p.opacity = 0.5;
				this.p.time += dt*1000;
				this.p.v = this.p.patrol;
				if(this.p.time>=this.p.patrolTime){
					this.turn((this.p.dir+180)%360,1);
				}
				
			}
			
			this.p.vy = -this.p.v*Math.sin(this.p.dir*Math.PI/180);
			this.p.vx = this.p.v*Math.cos(this.p.dir*Math.PI/180);
			
			if(this.p.cono.p.alert > 0){
				if(this.p.state == 0){
					hattori.p.enemies++;
					this.p.cono.p.asset="cono_grande.png";
					this.p.cono.size(true);
				}
				this.p.state = 1;
			}else{ 
				if(this.p.state == 1){
					hattori.p.enemies--;
					this.p.cono.p.asset="cono.png";
				}

				this.p.state = 0;
			}
			
			Q.state.set("state", hattori.p.enemies);

			this.p.cono.p.angle=this.p.angle;
			
			this.p.cono.p.x = this.p.x + (this.p.h*this.p.scale/2+this.p.cono.p.h*this.p.cono.p.scale/2)*Math.cos(this.p.dir*Math.PI/180);
			this.p.cono.p.y = this.p.y - (this.p.h*this.p.scale/2+this.p.cono.p.h*this.p.cono.p.scale/2)*Math.sin(this.p.dir*Math.PI/180);
			


			//gamestate
		}

	});

	Q.animations('enemy anim', {
		stand: { frames: [0], rate: 1 }
	});

	
	////////////////////////////////////////////////////////////////////
	///////////////////////      KUMO       ////////////////////////////
	////////////////////////////////////////////////////////////////////
	
	Q.Sprite.extend("Kumo", {
	  
	  init: function(p) {
		this._super(p, {
			asset: "kumo-jailed.png",
			scale: 0.2,
			x: 4500,
			y: 500
		});
		this.add('2d');
		this.on("hit", this, "win");
	  },
	  win: function(collision){
		if(collision.obj.isA("Hattori")){
			collision.obj.del('platformerControls');
			Q.stageScene("endGame", 2, {label: "You release the quacking!!"});
		}
	  }
	  
	});
	
	
	////////////////////////////////////////////////////////////////////
	///////////////////////      WEAPONS       /////////////////////////
	////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////Shuriken////////////////////////////////
	
	Q.Sprite.extend("Shuriken",{
		init:function(p){
			this._super(p,{
				dir:0,
				asset:"shuriken.png",
				vy:0,
				vx:0,
				sensor: true,
				scale:0.2,
				shooter: ""
			});
			this.p.vy=-Q.height*Math.sin(this.p.dir*(Math.PI/180));
			this.p.vx=Q.width*Math.cos(this.p.dir*(Math.PI/180));
			this.p.y+=-30*Math.sin(this.p.dir*(Math.PI/180));
			this.p.x+=30*Math.cos(this.p.dir*(Math.PI/180));
			
			this.add('2d, animation, tween');
			this.on("hit",this,"hit");
		},
		
		hit: function(collision){
			if(this.p.shooter == "Hattori"){  //hattori throws it
				if(!collision.obj.isA("Hattori")){
					if(collision.obj.isA("Enemy")){
						collision.obj.hurt();
					}
					if(!collision.obj.isA("Cono")){
						this.destroy();
					}
				}
			}else{		//An enemy throws it
				if(!collision.obj.isA("Enemy")){
					if(collision.obj.isA("Hattori")){
						collision.obj.hurt();
					}
					if(!collision.obj.isA("Cono")){
						this.destroy();
					}
				}
			}
			
		},
		
		step:function(dt){
			
			//this.animate({angle: 45});
		}
	});
	
	
	//////////////////////////// Katana //////////////////////
	
	Q.Sprite.extend("Katana",{
		init:function(p){
			this._super(p,{
				dir:0,
				asset:"katana.png",
				sensor: true,
				scale:0.1,
				attacking: false,
				finAttack: false
			});
			this.p.cy = 0;
			this.p.cx = this.p.w/2;
			this.add('2animation, tween');
			this.size(true);
			this.on("hit",this,"hit");
		},
		hit: function(collision){
			if(this.p.attacking && !this.p.finAttack){
				if(!collision.obj.isA("Hattori")){
					if(collision.obj.isA("Enemy")){
						collision.obj.hurt();
						this.p.finAttack = true;
					}
				}
			}
		},
		step:function(){
			
		}
	});
	
	
	////////////////////////////////////////////////////////////////////
	///////////////////////      ITEMS       ///////////////////////////
	////////////////////////////////////////////////////////////////////

	
	//////////////////////////////Potion////////////////////////////////	
	
	Q.Sprite.extend("Potion", {
	  
	  init: function(p) {
		this._super(p, {
			asset: "health-potion.png",
			sensor: true,
			catched: false,
			scale: 0.3,
			x: 1800,
			y: 100
		});
		this.add('2d');
		this.on("hit", this, "up");
	  },
	  up: function(collision){
		if(collision.obj.isA("Hattori") && !this.p.catched){
			this.p.catched = true;
			
			if((Q.state.get("health") + 30) > maxHealth) 
				Q.state.set({health: maxHealth});
			else
				Q.state.inc("health", 30);
			
			this.destroy();
		}
	  },
	  step: function(dt) {
		// Tell the stage to run collisions on this sprite
		}
	  
	});
	
	
	//////////////////////////////Shurikens-Bag////////////////////////////////	
	
	Q.Sprite.extend("Bag", {
	  
	  init: function(p) {
		this._super(p, {
			asset: "bag.png",
			sensor: true,
			catched: false,
			scale: 0.5,
			x: 1800,
			y: 100
		});
		this.add('2d');
		this.on("hit", this, "up");
	  },
	  up: function(collision){
		if(collision.obj.isA("Hattori") && !this.p.catched){
			this.p.catched = true;
			
			if((Q.state.get("shurikens") + 5) > maxShurikens) 
				Q.state.set({shurikens: maxShurikens});
			else
				Q.state.inc("shurikens", 5);
			
			this.destroy();
		}
	  },
	  step: function(dt) {}
	  
	});
	
	
	
/*
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

	});*/
	
	///////////////////////////// Cono /////////////////////////////
	Q.Sprite.extend("Cono",{
		init:function(p){
			this._super(p, {
				asset:"cono.png",
				x: 500,
				y: 800,
				opacity: 0.5,
				alert: 0,
				scale:1
			});
			this.p.sensor=true;
			this.on("hit", this, "hit");
			this.size(true);
			Q._generatePoints(this,true);
		},
		
		hit: function(collision){
		
			if(collision.obj.isA("Hattori") || (collision.obj.isA("Shuriken") && !collision.obj.p.enemy)){
				this.p.alert = 300;
				//console.log(collision.obj.className);
			}
		},	
		
		step:function(dt){
			if(this.p.alert > 0)
				this.p.alert--;
			
		}
	});
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////   STAGES   //////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	
	
	Q.scene("HUD",function(stage) {
		var sh = new Q.UI.Text({x: 100, y: 20, label:  "Health " + Q.state.get("health") + "\n Shurikens "+ Q.state.get("shurikens"), color: "#707070", outlineWidth: 3});
  		var weapon = new Q.Sprite({scale:0.3, x: 100, y: 120, asset: Q.state.get("weapon")});
		
		var box = stage.insert(new Q.UI.Container({x: 100, y: 20 , fill: "rgba(f,f,f,0)"}));

		var alert;
		if(Q.state.get("state")){
			alert = new Q.Sprite({x: 100, y: 200, asset: "alert.png", opacity:1});
		}else{
			alert = new Q.Sprite({x: 100, y: 200, asset: "calm.png", opacity:0});
		}

		box.insert(sh);
		box.insert(weapon);
		box.insert(alert);

	});
	
	Q.scene('endGame',function(stage) {
		var box = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
		}));
		
		var txt = stage.options.label;
	
		var button2 = box.insert(new Q.UI.Button({ x: 0, y: 60, fill: "#CCCCCC",
											   label: "Play Again" }));        
		
		var label = box.insert(new Q.UI.Text({cx: button2.width/2, y: -10 - button2.p.h, 
											label: txt }));
											
		button2.on("click", function() {
			console.log("click on play again");
			Q.clearStages();

			Q.state.set({health: maxHealth, shurikens: maxShurikens});
			Q.state.on("change.health, change.shurikens, change.weapon, change.state", function(){
				Q.stageScene("HUD", 1, 
					{label: "Health " + Q.state.get("health") + "Shurikens "+ Q.state.get("shurikens")});
					});
			
			Q.stageScene('level1', 0);
			Q.stageScene('HUD', 1);
		});
		box.fit(20);
	});



	Q.loadTMX("mapa2.tmx",function() {
		Q.stageScene("level1", 0);
		Q.stageScene('HUD', 1);
		//Q.debug = true;
	});


	// ## Level1 scene
		// Create a new scene called level 1
	Q.scene('level1', function(stage) {
		Q.stageTMX("mapa2.tmx", stage);
		center = stage.add("viewport");
		hattori = stage.insert(new Q.Hattori({x: 500, y: 500}));
		var kumo = stage.insert(new Q.Kumo({x: 500, y: 2500}));
		var potion = stage.insert(new Q.Potion({x:6816, y:736}));
		var bag = stage.insert(new Q.Bag({x:6716, y:736}));
		/*var enemies=[];
		for(var i=0; i<46; i++){
			enemies[i]=stage.insert(new Q.Enemy({x:(i+10)*100}));
		}*/
		
		var enemy = stage.insert(new Q.Enemy({}));
		var enemy2 = stage.insert(new Q.Enemy({x:700, y:2000, scale: 1, health: 60}));
		var enemy3 = stage.insert(new Q.Enemy({x:2800, y:800}));
		var enemy4 = stage.insert(new Q.Enemy({x:3600, y:700, dir: 0}));
		var enemy5 = stage.insert(new Q.Enemy({x:3600, y:2500}));
		var enemy6 = stage.insert(new Q.Enemy({x:3600, y:1500, dir: 0}));
		var enemy7 = stage.insert(new Q.Enemy({x:5600, y:700}));
		var enemy8 = stage.insert(new Q.Enemy({x:6600, y:700}));
		var enemy9 = stage.insert(new Q.Enemy({x:6400, y:1700}));
		var enemy10 = stage.insert(new Q.Enemy({x:6400, y:2700}));
		
		center.follow(hattori, {x:true, y:true});
	});
    
}
