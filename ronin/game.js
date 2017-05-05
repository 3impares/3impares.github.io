////////////////////////////////ini///////////////////////////
var game = function(){
	var Q = window.Q = Quintus({ audioSupported: [ 'mp3', 'ogg' ] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio").enableSound()
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch();

		Q.load(["hattori.png", "hattori.json"], function(){
			Q.compileSheets("hattori.png", "hattori.json");
		});
		

	//////////////////////////////////Hattori////////////////////
	Q.Sprite.extend("Hattori", {
		init: function(){
			this._super({
				sheet: "hattori",
				sprite: "hattori anim",
				x:Q.width/2,
				y:Q.height/2,
				gravity: 0
			});
			this.add('2d, animation, platformerControls');
		},
		
		step: function(dt){
			this.play("stand");
		}

	});
	Q.animations('hattori anim', {
		stand: { frames: [0], rate: 1 }
	});
	
	
	Q.loadTMX("mapa1.tmx", function() {
		Q.stageScene("mainTitle", 0);
		console.log("edbfiywbdefioubwoeudfewourhfouehrofuheofhoeurbvofubefubeoirbvfiuerbfouwbdovubwoduvbeoub");
		//Q.debug = true;
	});


	Q.scene('mainTitle', function(stage) {
		var box = stage.insert(new Q.UI.Container({
			cx: Q.height/2, cy: Q.height/2,  fill: "rgba(0,0,0,1)"
		}));
		var button = box.insert(new Q.UI.Button({ x: Q.width/2, y: Q.height/2, fill: "#CCCCCC", asset: "bg.png" })); 
		console.log(button.p.border);
		setTimeout(function(stage){Q.stageScene("mapa1"); console.log("settimeout");}, 1000);
		button.on("click", init);
		document.addEventListener("keyup", listener);
		
	});
	
	var listener = function (evt) {
		if(evt.which==13) init();
	};
	
	var init = function(){
		document.removeEventListener("keyup", listener);
		document.removeEventListener("touchend", init);
		console.log("en el init")
		Q.stageScene('mapa1');
		
	};


	
	// ## Level1 scene
		// Create a new scene called level 1
	Q.scene('mapa1', function(stage) {
		Q.stageTMX("mapa1.tmx", stage);
		var hattori = stage.insert(new Q.Hattori());
		console.log(hattori.p.x);
		stage.add("viewport").follow(hattori, {x:true, y:true});
	});
	
	
}