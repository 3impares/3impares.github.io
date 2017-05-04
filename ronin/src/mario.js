var game = function() {

// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` componet.
var Q = window.Q = Quintus({ audioSupported: [ 'mp3', 'ogg' ] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio").enableSound()
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch();

var purse=[{x: 250, y: 500}, {x: 650, y:475}, {x: 1000, y:475},
           {x: 900, y: 475}, {x: 850, y: 375}, {x: 1150, y: 50},
           {x: 1200, y:50}, {x: 1250, y:50}, {x: 1075, y:75},
           {x: 1500, y:280}, {x: 1750, y:420}, {x: 2340, y:225},
           {x: 2380, y:525}, {x: 3025, y:525}, {x: 3335, y:450},
           {x: 3635, y:525}, {x: 3825, y:480}, {x: 1600, y:450}];
Q.animations("mario_anim", {
  walk_right: { frames: [0,1,2,3], rate: 1/10, flip: false, loop: true}, 
  walk_left: { frames: [15,16,17], rate: 1/10, flip:false, loop: true}, 
  jump_right: { frames: [4], rate: 1/10, flip: false },
  jump_left: { frames: [18], rate: 1/10, flip: false },
  stand_right: { frames:[0], rate: 1/10, flip: false },
  stand_left: { frames: [14], rate: 1/10, flip:false },
  duck_right: { frames: [15], rate: 1/10, flip: false },
  die: { frames: [12], rate: 0.75, loop:false, trigger:"died"},
  duck_left: { frames: [15], rate: 1/10, flip: "x" },
  climb: { frames: [16, 17], rate: 1/3, flip: false }
});

Q.animations("bloopa_anim", {
  stand: { frames: [0], rate: 1/10, flip: false}, 
  up: { frames: [1], rate: 1/10, flip:false}, 
  down: { frames: [2], rate: 1/10, flip: false }
});

Q.animations("goomba_anim", {
  move: { frames: [0, 1], rate: 1/2, flip: false, loop: true}, 
  die: { frames: [2], rate: 1, loop: false, trigger:"died"},
  down: {frames: [3], rate: 2, loop: false, trigger:"nofall"}
});

Q.animations("coin_anim", {
  stand: { frames: [0, 1, 2], rate: 1/2, flip: false, loop: true},
  take: { frames: [0, 1, 2], rate: 0.1, flip: false, loop: false, trigger:"toke"}
});


// ## Player Sprite
// The very basic player sprite, this is just a normal sprite
// using the player sprite sheet with default controls added to it.
Q.Sprite.extend("Mario",{

  // the init constructor is called on creation
  init: function(p) {

    // You can call the parent's constructor with this._super(..)
    this._super(p, {
      sprite: "mario_anim",
      sheet: "mario",  // Setting a sprite sheet sets sprite width and height
      x: 150,           // You can also set additional properties that can
      y: 380,           // be overridden on object creation
      gravity: 0.6             
    });
    this.add('2d, platformerControls, animation');

    Q.input.on("fire",this,"die");

    this.on("bump.top",function(collision) {
        if(collision.obj.isA("Mario")) {
          collision.obj.p.vy = -300;
        }
    });

    this.on("died", this, "destroy");
  },

  die: function(){
   this.play("die", 1);
   Q.stageScene("endGame",1, { label: "You Died" });
   this.del('platformerControls');
  },

  jump:function(){
    this.p.vy=-300;
  },
  step: function(dt){
    if(this.p.vy!=0){
      this.play("jump_"+this.p.direction);
    }else if(this.p.vx > 0) {
      this.play("walk_right"); 
    } else if(this.p.vx < 0) {
      this.play("walk_left"); 
    } else {
      this.play("stand_" + this.p.direction);
    }
    
    if(this.p.y> 550){
      this.die();
    }
  }

});

Q.Sprite.extend("Princess", {
  init:function(){
    this._super({
      asset:"princess.png",
      x: 4600,
      y: 525, 
      gravity:1
    });
    this.add('2d');
    this.p.sensor=true;
    this.on("bump.top, bump.right, bump.bottom, bump.left", function(collision){
      if(collision.obj.isA("Mario")){
        Q.stageScene("endGame",1, { label: "You win" }); 
        Q.audio.stop('music_main.mp3');
        Q.audio.play('music_level_complete.mp3',{ loop: false });
        collision.obj.del('platformerControls');
      }
    });
  }
});

Q.Sprite.extend("Coin", {
  init:function(){
    this._super({
      sprite:"coin_anim",
      sheet:"coin",
      x: 250,
      y: 500, 
      gravity:0,
      taken:false
    });
    this.add('2d, animation, tween');
    this.p.sensor=true;
    this.on("bump.top, bump.right, bump.bottom, bump.left", function(collision){
       if(collision.obj.isA("Mario")) { 
        this.up();
       /* if(!this.taken){
          Q.state.inc("score",1);
          this.taken=true;
        }*/
      }
    });
    this.on("toke", this, "destroy");
  },
  up: function(){
    //Q.audio.stop('coin.mp3');
    Q.audio.play('coin.mp3',{ loop: false });
    this.animate({ x: this.p.x, y: this.p.y-100, angle: 0, opacity:0.5 }, 0.1);
    this.play("take", 1);
  },
  step: function(){
    this.play("stand");
  }

});

Q.component("defaultEnemy",{
  added:function(){
    this.entity.on("bump.left,bump.right,bump.bottom",function(collision) {
        if(collision.obj.isA("Mario")) { 
            collision.obj.die();
        }
    });
  }
});

Q.Sprite.extend("Goomba",{//seta
  init: function(p) {
    this._super(p, {
      sprite: "goomba_anim",
      sheet: "goomba",  // Setting a sprite sheet sets sprite width and height
      x: 250,           // You can also set additional properties that can
      y: 380,           // be overridden on object creation
      gravity: 1,
      vx: 100             
    });
    this.add('2d, animation, aiBounce, tween, defaultEnemy');
    this.on("bump.top",function(collision) {
        if(collision.obj.isA("Mario")) {
          this.die();
          this.p.vx=0;
          collision.obj.p.vy = -300;
        }
    });
   
    this.on("died", this, "death");
    this.on("nofall", this, "destroy");
  },
  death: function(){
    this.animate({ x: this.p.x, y: this.p.y+300, angle: 0 }, 1);
    this.play("down", 1);
  },
  die: function(){this.play("die", 1);},
  
  step: function(dt){
    this.play("move");
    if(this.p.y > 550){
      this.p.x = 150;
      this.p.y = 380;
      this.p.vy = 0;
    }
  }

});

Q.Sprite.extend("Bloopa",{//calamar
  init: function(p) {
    this._super(p, {
      sprite: "bloopa_anim",
      sheet: "bloopa",  // Setting a sprite sheet sets sprite width and height
      x: 350,           // You can also set additional properties that can
      y: 380,           // be overridden on object creation
      gravity: 0.1,
      death: false 
    });
    this.add('2d, animation, aiBounce, defaultEnemy');
    this.on("bump.top",function(collision) {
        if(collision.obj.isA("Mario")) {
          this.death=true;
          this.play("down", 1);
          collision.obj.p.vy = -300;
        }
    });
    this.on("bump.bottom",function(collision) {
      this.p.vy = -100;
    });
  },
  step: function(dt){
    if(!this.death){
    if(this.vy>0){
      this.play("down");
    }else if(this.vy<0){
      this.play("up");
    }else
      this.play("stand");

    if(this.p.y > 550){
      this.p.x = 150;
      this.p.y = 380;
      this.p.vy = 200;
    }
  }
}
});
Q.state.on('change.score', function(){
  console.log("score1");  
});
/*
Q.scene("score",function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  var x="score: "+Q.state.get("score");

  container.insert(new Q.UI.Text({x:10, y: -10, label: x }));

});
*/

Q.load([ "music_main.mp3", "coin.mp3", "music_level_complete.mp3" ], function() { 
  Q.audio.play('music_main.mp3',{ loop: true });
});

Q.load(["mainTitle.png","princess.png","coin.png","coin.json","mario_small.png", "mario_small.json", "goomba.png", "goomba.json", "bloopa.png", "bloopa.json"], function(){
        Q.compileSheets("mario_small.png", "mario_small.json");
        Q.compileSheets("goomba.png", "goomba.json");
        Q.compileSheets("bloopa.png", "bloopa.json");
        Q.compileSheets("coin.png", "coin.json");
      });

Q.scene("level1",function(stage) {
      
      Q.stageTMX("level.tmx",stage);
      
      var mario = stage.insert(new Q.Mario());
      
      var coin =[];

      for(var i=0; i<purse.length; i++){
        coin[i]= stage.insert(new Q.Coin());
        coin[i].p.x=purse[i].x;
        coin[i].p.y=purse[i].y;
      }
      var princess=stage.insert(new Q.Princess());
      var goomba = stage.insert(new Q.Goomba());
      var bloopa = stage.insert(new Q.Bloopa());
      stage.add("viewport").follow(mario,{ x: true, y: false });
});
 
Q.loadTMX("level.tmx", function() {
    //Q.stageScene("level1");
    Q.stageScene("menu");

});

Q.scene('endGame',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Play Again" }));         
  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                   label: stage.options.label }));
  button.on("click",function() {
    Q.clearStages();
    Q.audio.stop();
    Q.audio.play('music_main.mp3',{ loop: true });
    Q.stageScene('level1', 0);
    //Q.stageScene('score', 1);
  });

  container.fit(20);
});

Q.scene('menu',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", w:Q.width, h:Q.height, asset:"mainTitle.png" })); 
  
  button.on("click",function() {
    Q.clearStages();
    Q.state.reset({score:0});
    Q.stageScene('level1', 0);
    //Q.stageScene('score', 1);
  });

});

}