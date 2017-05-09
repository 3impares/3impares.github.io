
 
window.addEventListener('load',function(e) {

 
  var Q = window.Q = Quintus().include("Sprites, Scenes, 2D, Input")
                              .setup({ width: 1000, height: 600 });

 
  function drawLines(ctx) {
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    for(var x = 0;x < 1000;x+=100) {
      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x,600);
      ctx.stroke();
    }
    ctx.restore();
  }

 
  Q.scene("start",function(stage) {

 
    var sprite1 = new Q.Sprite({ x: 500, y: 100, asset: 'enemy.png', 
                                 angle: 0, collisionMask: 1, scale: 1});
    sprite1.p.points = [
      [ -150, -120 ],
      [  150, -120 ],
      [  150,   60 ],
      [   90,  120 ],
      [  -90,  120 ],
      [ -150,   60 ]
      ];
    stage.insert(sprite1);

 
    sprite1.add('2d')

    sprite1.on('step',function() {

    });

 
    var sprite2 = new Q.Sprite({ x: 500, y: 600, w: 300, h: 200 });
    sprite2.draw= function(ctx) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(-this.p.cx,-this.p.cy,this.p.w,this.p.h);
    };
    stage.insert(sprite2);

 
    Q.input.on('up',stage,function(e) { 
      sprite1.p.scale -= 0.1;
    });

    Q.input.on('down',stage,function(e) { 
      sprite1.p.scale += 0.1;
    });

    Q.input.on('left',stage,function(e) {
      sprite1.p.angle -= 5;
    });

    Q.input.on('right',stage,function(e) {
      sprite1.p.angle += 5;
    });

    Q.input.on('fire',stage,function(e) {
      sprite1.p.vy = -600;
    });

    Q.input.on('action',stage,function(e) {
      sprite1.p.x = 500;
      sprite1.p.y = 100;
    });

 
    stage.on('postrender',drawLines);
  });

  Q.load('enemy.png',function() {

 
    Q.stageScene("start");
 
    Q.debug = true;


 
    Q.input.keyboardControls();
  });

});