var canvas = oCanvas.create({
	canvas: "#canvas"
});

var button = canvas.display.rectangle({
	x: canvas.width / 2,
	y: canvas.width / 5,
	origin: { x: "center", y: "center" },
	width: 300,
	height: 40,
	fill: "#079",
	stroke: "10px #079",
	join: "round"
});
var buttonText = canvas.display.text({
	x: 0,
	y: 0,
	origin: { x: "center", y: "center" },
	align: "center",
	font: "bold 25px sans-serif",
	text: "Toggle Rotation",
	fill: "#fff"
});
button.addChild(buttonText);

var image=canvas.display.image({
	x:70,
	y:70,
	width: 175,
	height: 190,
	origin: { x: "center", y: "center" },
	image: "img/yasuo.svg"
});

var pentagon = canvas.display.polygon({
	x: canvas.width / 1.5,
	y: 50,
	sides: 5,
	radius: 60,
	fill: "#18a"
});
var hexagon = pentagon.clone({ sides: 6, x: 70, y: pentagon.y + 180, fill: "#29b" });

canvas.addChild(hexagon);
canvas.addChild(button);
canvas.addChild(pentagon);
canvas.addChild(image);

var dragOptions = { changeZindex: true };

pentagon.dragAndDrop(dragOptions);
hexagon.dragAndDrop(dragOptions);
image.dragAndDrop(dragOptions);

canvas.setLoop(function () {
	pentagon.rotation--;
	hexagon.rotation++;
	image.rotation+=90;
});

button.bind("click tap", function () {
	if (canvas.timeline.running) {
		canvas.timeline.stop();
	} else {
		canvas.timeline.start();
	}
});