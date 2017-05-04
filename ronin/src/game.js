////////////////////////////////ini///////////////////////////
var game = function(){
	var Q = window.Q = Quintus({ audioSupported: [ 'mp3', 'ogg' ] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio").enableSound()
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch();


	//////////////////////////////////Hattori////////////////////
	Q.Sprite.extend("Hattori", {
		init: function(){

			this._super({
				sprite: "yasuo",
	      		sheet: "yasuo",
				x:Q.w/2,
				y:Q.h/2
			});
		}


	});










	////////////////////////////////////Scene//////////////////

	Q.load(["yasuo.svg"], function(){
	        Q.compileSheets("yasuo.svg", "yasuo.json");
	});







};
