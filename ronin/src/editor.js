var board=[];

var width=100;
var height=100;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var KEY_BACK=8;


function init(){

	board[0]=[];
	board[width-1]=[];

	for(var a=0; a<height; a++){
		board[0][a]=11;
		board[width-1][a]=11;
	}

	for(var i=1; i<width-1;i++){
		board[i]=[];
		board[i][0]=11;	
		board[i][height-1]=11;
		for(var j=1; j<height-1; j++){
			board[i][j]=12;
		}
	}

};

function clear(){

};

function draw(){
/*
	for(var i=0; i<width; i++)
		for(var j=0; j<height; j++){
			converter(board[i][j]);			
		}
*/



};


function converter(i, j, x){
	switch(x){
		case 11:load(i,j,"wall");break;
		case 12:load(i,j,"grass");break;
	}

};


function load(i, j, image){	
	var img = new Image;

	img.src = "images/architect/"+image+".jpeg";

  	ctx.drawImage(img, i, j); // Or at whatever offset you like

};

function undo(){
	alert("undo");
};



$( "#export" ).click(function() {
  $( "#code" ).val(width+"\n"+height+"\n"+board);
});
$("#width").keyup(function(){
    width=$(this).val();
});
$("#height").keyup(function(){
    height=$(this).val();
});

window.addEventListener('keydown',function(e) {
  if(e.keyCode==KEY_BACK) {
   	undo();
   }
},false);

window.addEventListener('load', init, false); 