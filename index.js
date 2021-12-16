var c = document.getElementById('main-canvas');
var context = c.getContext('2d');
context.lineWidth = 1;
context.strokeStyle = 'rgb(20, 80, 200)';

var mainState = {
	numPoints: 300,
	multiplier: 2,
	points: [],
	center: [c.clientWidth / 2, c.clientHeight / 2],
	delta: 0.005,
	frequency: 0.3,
	radius: 0.95 * c.clientWidth / 2,
};

var sCanvas = document.getElementById('secondary-canvas')
var sContext = sCanvas.getContext('2d');
sContext.lineWidth = 1;
sContext.strokeStyle = 'rgb(20, 80, 200)';

var secondaryState = {
	numPoints: 300,
	multiplier: 2,
	points: [],
	center: [sCanvas.clientWidth / 2, sCanvas.clientHeight / 2],
	radius: 0.95 * sCanvas.width / 2,
};

window.requestAnimationFrame(draw);

function draw() {
	const red = Math.sin(mainState.frequency*mainState.multiplier) * 127 + 128;
	const green = Math.sin(mainState.frequency*mainState.multiplier + 2) * 127 + 128;
	const blue = Math.sin(mainState.frequency*mainState.multiplier + 4) * 127 + 128;

	c = document.getElementById('main-canvas');
	context = c.getContext('2d');
	context.lineWidth = 1;
	context.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
	context.save();

	mainState.multiplier = (mainState.multiplier + mainState.delta) % mainState.numPoints;
	multiplierInput.value = mainState.multiplier;
	context.clearRect(0, 0, c.width, c.height);
	drawPoints(context, mainState);
	newDrawLines(context, mainState);

	requestAnimationFrame(draw);
}

function drawPoints(ctx, state) {
	state.points = []
	for (i = 0; i < state.numPoints; i++) {
		ctx.beginPath();
		var x = mainState.center[0] + state.radius * Math.cos(i * 2*Math.PI / state.numPoints);
		var y = mainState.center[1] + state.radius * Math.sin(i * 2*Math.PI / state.numPoints);
		state.points.push({x: x, y: y});
		ctx.arc(x, y, 1, 0, 2*Math.PI);
		ctx.stroke();
	}
}

function drawLines(ctx, state) {
	state.points.forEach((point, index) => {
		const endPoint = state.points[(state.multiplier * index) % state.numPoints]; 
		ctx.moveTo(point.x, point.y);
		ctx.lineTo(endPoint.x, endPoint.y);
		ctx.stroke();
	});
}

function newDrawLines(ctx, state) {
	state.points.forEach((point, index) => {
		const x = mainState.center[0] + state.radius * Math.cos(index * state.multiplier * 2*Math.PI / state.numPoints);
		const y = mainState.center[1] + state.radius * Math.sin(index * state.multiplier * 2*Math.PI / state.numPoints);
		ctx.moveTo(point.x, point.y);
		ctx.lineTo(x, y);
		ctx.stroke();
	});
}

///////////////////////////////////////
///////////////  MAIN UI   ////////////
///////////////////////////////////////

var pointsInput = document.getElementById('points-input');
var multiplierInput = document.getElementById('multiplier-input');
var renderBtn = document.getElementById('render-button');
var animateBtn = document.getElementById('animate-button');
var speedInput = document.getElementById('speed-input');

pointsInput.value = mainState.numPoints;
pointsInput.addEventListener('input', (e) => {
	mainState.numPoints = e.currentTarget.value === '' ? 0 : e.currentTarget.value;
});

multiplierInput.value = mainState.multiplier;
multiplierInput.addEventListener('input', (e) => {
	mainState.multiplier = e.currentTarget.value === '' ? 1 : e.currentTarget.value;
});

renderBtn.addEventListener('click', () => {
	context.clearRect(0, 0, c.width, c.height);
	drawPoints(context, mainState);
	drawLines(context, mainState);
});

animateBtn.addEventListener('click', () => {
	draw();
});

speedInput.value = mainState.delta;
speedInput.addEventListener('input', (e) => {
	mainState.delta = e.currentTarget.value === '' ? 1 : parseFloat(e.currentTarget.value);
});

///////////////////////////////////////
///////////////  SECONDARY UI   ////////////
///////////////////////////////////////

var pointsInputSecondary = document.getElementById('points-input-secondary');
var multiplierInputSecondary = document.getElementById('multiplier-input-secondary');
var renderBtnSecondary = document.getElementById('render-button-secondary');

pointsInputSecondary.value = secondaryState.numPoints;
pointsInputSecondary.addEventListener('input', (e) => {
	secondaryState.numPoints = e.currentTarget.value === '' ? 0 : e.currentTarget.value;
});

multiplierInputSecondary.value = secondaryState.multiplier;
multiplierInputSecondary.addEventListener('input', (e) => {
	secondaryState.multiplier = e.currentTarget.value === '' ? 1 : e.currentTarget.value;
});

renderBtnSecondary.addEventListener('click', () => {
	sContext.clearRect(0, 0, sCanvas.width, sCanvas.height);
	drawPoints(sContext, secondaryState);
	drawLines(sContext, secondaryState);
});