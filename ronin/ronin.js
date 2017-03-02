var KEY_ENTER = 13,
 KEY_LEFT = 37,
 KEY_UP = 38,
 KEY_RIGHT = 39,
 KEY_DOWN = 40,
 KEY_W=87,
 MAX_MALOS=20,

 yasuo=new Image(),
 canvas = null,
 ctx = null,
 lastPress = null,
 pause = true,
 player=null;
 cadaveres = new Array(),
 wall=new Array(),
 enemigo=new Array(),
 score=0,
 dir = 0,
 andar=false;
 gameover=false;
 
 
function random(max) { 
	return Math.floor(Math.random() * max);
}

function reset() {
	score = 0;
	dir = 1;
	cadaveres.length = 0;
	player=new Rectangle(40, 40, 10, 10);
	enemigo.x = random(canvas.width / 10) * 10;
	enemigo.y = random(canvas.height / 10 - 1) * 10; 
	gameover = false;
	andar=false;
}
	
function paint(ctx) {
	//background
	ctx.fillStyle='#fff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//cadaveres
	ctx.fillStyle = '#ff0';
	for (var i=0; i<cadaveres.length;i++){
		cadaveres[i].fill(ctx);
	}
	
	//enemigo
	ctx.fillStyle = '#f00';
	for(var i=0;i<MAX_MALOS;i++){
		enemigo[i].fill(ctx);
	}
	
	//player
	//ctx.fillStyle = '#0f0';
	ctx.drawImage(yasuo,player.x,player.y,100,50);
	//player.fill(ctx);
	
	//score
	ctx.fillStyle='#000';
	ctx.fillText('Score: ' + score, 0, 10);
	//walls
	ctx.fillStyle = '#999';
	for (i = 0, l = wall.length; i < l; i += 1) {
		wall[i].fill(ctx);
	} 
	if (pause) {
		ctx.textAlign = 'center';
		if(gameover)
			ctx.fillText('GAME OVER', 150, 75);
		else
			ctx.fillText('PAUSE', 150, 75);
		ctx.textAlign = 'left';
	} 
} 
	
function act(){
	if (!pause) { 
		if (gameover) { 
			reset(); 
		}
		if(andar){
			
			
			
			// Change Direction
			if (lastPress == KEY_UP) {
				dir = 0;
			} 
			if (lastPress == KEY_RIGHT) dir = 1;
			if (lastPress == KEY_DOWN)  dir = 2;
			if (lastPress == KEY_LEFT)  dir = 3;
			
			// Move Rect
			if (dir == 0)  player.y -= 10;
			if (dir == 1)  player.x += 10; 
			if (dir == 2)  player.y += 10; 
			if (dir == 3)  player.x -= 10; 

			// Out Screen
			if (player.x > canvas.width-50) player.x = canvas.width-50;
			if (player.y > canvas.height-50) player.y = canvas.height-50;
			if (player.x < 0) player.x = 0;
			if (player.y < 0)  player.y =0;
			
		
			for(var i=0;i<MAX_MALOS;i++){
				if (player.intersects(enemigo[i])) {
					score += 1;
					cadaveres.push(new Rectangle(enemigo[i].x, enemigo[i].y, 100, 50));
					enemigo[i].x = random(canvas.width / 50 - 1) * 50;
					enemigo[i].y = random(canvas.height / 50 - 1) * 50;
				}
			}
			for (i = 0, l = wall.length; i < l; i += 1) {
				if (enemigo.intersects(wall[i])) {
					enemigo.x = random(canvas.width / 50 - 1) * 50;
					enemigo.y = random(canvas.height / 50 - 1) * 50;
				}

				if (player.intersects(wall[i])) {
					gameover = true; pause = true;
				} 
			}
		}
	}
	// Pause/Unpause
	if (lastPress == KEY_ENTER) {
		
		pause = !pause;
		lastPress = null;
	}  
	
}
	
function repaint() {
	 window.requestAnimationFrame(repaint);
	 paint(ctx);
 } 
 
function run(){
	setTimeout(run,50);
	act();
}
 
function init() { 
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	cadaveres.length = 0;
	player=new Rectangle(40, 40, 100, 50);
	yasuo.src='img/yasuo.svg';
	enemigo.length=0;
	for(var i=0;i<MAX_MALOS;i++){
		enemigo.push(new Rectangle(random(canvas.width / 50 - 1) * 50, random(canvas.height / 50 - 1) * 50, 100, 50));
	}
	// Create walls
	/*
	wall.push(new Rectangle(100, 50, 10, 10));
	wall.push(new Rectangle(100, 100, 10, 10));
	wall.push(new Rectangle(200, 50, 10, 10));
	wall.push(new Rectangle(200, 100, 10, 10));
	*/
	run();
	repaint();
}

function Rectangle(x, y, width, height) {
	this.x = (x == null) ? 0 : x;
	this.y = (y == null) ? 0 : y;
	this.width = (width == null) ? 0 : width;
	this.height = (height == null) ? this.width : height;
	this.intersects = function (rect) {
		if (rect == null) {
			window.console.warn('Missing parameters on function intersects');
		} else {
			return (this.x < rect.x + rect.width &&
				this.x + this.width > rect.x &&
				this.y < rect.y + rect.height &&
				this.y + this.height > rect.y);
		}
	};
	this.fill = function (ctx) {
		if (ctx == null) { 
			window.console.warn('Missing parameters on function fill');
		} else {
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};
}

 window.addEventListener('load', init, false); 
 
 document.addEventListener('keydown', function (evt) {
 if(evt.which==KEY_W)
	andar=true;
else
	lastPress = evt.which;
 
 }, false); 
 
 
 document.addEventListener('keyup', function (evt) {
 if(evt.which==KEY_W)
	andar=false; 
 }, false); 