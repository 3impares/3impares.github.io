////////////////////////////////ini///////////////////////////
var game = function(){
	var Q = window.Q = Quintus({ audioSupported: [ 'mp3', 'ogg' ] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio").enableSound()
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch();

		Q.load(["hattori.png", "hattori.json", "cursor.png", "cursor.json"], function(){
			Q.compileSheets("hattori.png", "hattori.json");
			Q.compileSheets("cursor.png", "cursor.json");
		});
		
	var mousex, mousey;
	Q.el.addEventListener('mousemove',function(e) {
    	mousex = e.offsetX || e.layerX,
        mousey = e.offsetY || e.layerY;
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
				gravity: 0,
				scale:0.5
			});
			this.add('2d, animation, platformerControls');
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
			this.p.angle=-this.trigonometry(mousex, mousey)-90;
		} 
		

	});
	/////////////////////////////cursor////////////////////
	Q.Sprite.extend("Cursor",{
		init:function(){
			this._super({
				sheet:"cursor"
			});
			this.p.sensor=true;
		},
		trigonometry: function (x, y){
			var cos=(x-Q.width / 2)/(Q.width/2);
			var sin=-(y-Q.height / 2)/(Q.height/2);
			
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

	Q.animations('hattori anim', {
		stand: { frames: [0], rate: 1 }
	});
	
	
	Q.loadTMX("mapa1.tmx", function() {
		Q.stageScene("mainTitle", 0);
		//Q.debug = true;
	});


	Q.scene('mainTitle', function(stage) {
		var box = stage.insert(new Q.UI.Container({
			cx: Q.height/2, cy: Q.height/2,  fill: "rgba(0,0,0,1)"
		}));
		var button = box.insert(new Q.UI.Button({ x: Q.width/2, y: Q.height/2, fill: "#CCCCCC", asset: "bg.png" })); 
		setTimeout(function(stage){Q.stageScene("mapa1");}, 1000);
		button.on("click", init);
		document.addEventListener("keyup", listener);
		
	});
	
	var listener = function (evt) {
		if(evt.which==13) init();
	};
	
	var init = function(){
		document.removeEventListener("keyup", listener);
		document.removeEventListener("touchend", init);
		Q.stageScene('mapa1');
		
	};


	
	// ## Level1 scene
		// Create a new scene called level 1
	Q.scene('mapa1', function(stage) {
		Q.stageTMX("mapa1.tmx", stage);
		var hattori = stage.insert(new Q.Hattori());
		var cursor = stage.insert(new Q.Cursor());
		stage.add("viewport").follow(hattori, {x:true, y:true});
	});
	
	
}