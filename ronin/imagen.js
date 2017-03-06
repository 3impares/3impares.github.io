var s=new Image();

function start(){

	s.src='img/yaso.svg';

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	
	ctx.drawImage(s, canvas.width/2, canvas.height/2,100,50);


}




 window.addEventListener('load', start, false); 