/**-------------------------------------------------------------------------------------------------------------------------------------
**	 													CUSTUME SNAKE
-------------------------------------------------------------------------------------------------------------------------------------*/
var snakeCustume;
var userName;

/**-------------------------------------------------------------------------------------------------------------------------------------
**	 													SNAKE AND FOOD
-------------------------------------------------------------------------------------------------------------------------------------*/
var snake, snakeLength, snakeSize, snakeDir, snakeSpeed;
var snakeHeadX, snakeHeadY;
var food;
var foodShape = '🍎';
var snakeTail = { x: 0, y: 0 };

// ? EFECTS
var reboundAudio;
var backgroundSound;

// ? Audio
let backgroundAudio;
let homeMenuAudio;
let gameoverAudio;
/**-------------------------------------------------------------------------------------------------------------------------------------
**	 													GAME STATE
-------------------------------------------------------------------------------------------------------------------------------------*/
var estadoDelJuego = 'HOME';

// ? MENUS
var homeMenu;
var gameOverMenu;
var instructionMenu;
var pauseMenu;
var settingMenu;

// ? BUTTONS
var startButton;
var restartButton;
var goHomeButton;
var introButton;
var settingButton;
var pauseButton;
var backButton;
var backButton2;

/**-------------------------------------------------------------------------------------------------------------------------------------
**	 													CANVAS
-------------------------------------------------------------------------------------------------------------------------------------*/
var canvas, c, innerWidth, innerHeight;

/**-------------------------------------------------------------------------------------------------------------------------------------
**	 													SCORE AND SPEED
-------------------------------------------------------------------------------------------------------------------------------------*/
var score = 0;
var scoreboard;
var finalScore;
var scoreboardMenu;
var mode = 1;

/**-------------------------------------------------------------------------------------------------------------------------------------
**	 													MODE
-------------------------------------------------------------------------------------------------------------------------------------*/
var easyMode;
var hardMode;

/**-------------------------------------------------------------------------------------------------------------------------------------
**	 													LIFE
-------------------------------------------------------------------------------------------------------------------------------------*/
var lifeSnake;
var life = 3;
var lifeMenu;
var lifeboard;
var pause = true;

/**-------------------------------------------------------------------------------------------------------------------------------------
**	 													RANDOM COLOR
-------------------------------------------------------------------------------------------------------------------------------------*/
var rgb =
	'rgb(' +
	Math.floor(Math.random() * 256) +
	',' +
	Math.floor(Math.random() * 256) +
	',' +
	Math.floor(Math.random() * 256) +
	')';

/**-------------------------------------------------------------------------------------------------------------------------------------
**	 														INIT..
-------------------------------------------------------------------------------------------------------------------------------------*/
start();

function gameInt(estadoDelJuego) {
	canvas = document.querySelector('canvas');
	if (estadoDelJuego == 'HOME') {
		canvas.style.backgroundColor = 'purple';
	} else if (estadoDelJuego == 'PLAY') {
		canvas.style.backgroundColor = 'teal';
	} else if (estadoDelJuego == 'GAME OVER') {
		canvas.style.backgroundColor = 'darkred';
	}
	c = canvas.getContext('2d');

	// innerWidth = window.innerWidth;
	// innerHeight = window.innerHeight;
	scoreboard = document.getElementById('score');
	scoreboardMenu = document.getElementById('scoreboard');
	lifeMenu = document.getElementById('lifeMenu');
	lifeboard = document.getElementById('life');
	// lifeSnake = document.getElementById('lifeSnake');

	// ** GameMode
	easyMode = document.getElementById('EasyMode');
	hardMode = document.getElementById('HardMode');

	//** MENUS
	homeMenu = document.getElementById('homeMenu');
	settingMenu = document.getElementById('settingMenu');

	gameOverMenu = document.getElementById('gameOver');

	instructionMenu = document.getElementById('instructionMenu');
	pauseMenu = document.getElementById('pauseMenu');

	// ** BUTTOM GO HOME
	goHomeButton = document.getElementById('goHomeButton');
	goHomeButton.addEventListener('click', goHome);

	// ** BUTTON RESTART
	restartButton = document.getElementById('restartButton');
	restartButton.addEventListener('click', gameRestart);

	// ** BUTTON START
	startButton = document.getElementById('startButton');
	startButton.addEventListener('click', gameStart);

	// ** BUTTON introButton
	introButton = document.getElementById('introButton');
	introButton.addEventListener('click', instruction);

	// ** BUTTON settingButton
	settingButton = document.getElementById('settingButton');
	settingButton.addEventListener('click', setting);

	// ** BUTTON backButton
	backButton = document.getElementById('backButton');
	backButton.addEventListener('click', goBack);

	// ** BUTTON backButton2
	backButton2 = document.getElementById('backButton2');
	backButton2.addEventListener('click', goBack);

	// ** BUTTON pauseButton
	pauseButton = document.getElementById('pauseButton');
	pauseButton.addEventListener('click', pauseOff);

	//** SCORE FINAL
	finalScore = document.getElementById('finalScore');

	// * Audios
	backgroundAudio = document.getElementById('backgroundAudio');
	homeMenuAudio = document.getElementById('homeMenuAudio');
	gameoverAudio = document.getElementById('gameoverAudio');
	reboundAudio = document.getElementById('reboundAudio');
	backgroundSound = document.getElementById('backgroundSound');

	canvas.width = innerWidth;
	canvas.height = innerHeight;

	document.addEventListener('keydown', keyboardHanler);
	document.addEventListener('keydown', paused);

	setState(estadoDelJuego);
}

function gameDraw() {
	c.strokeStyle = 'red';
	c.fillStyle = 'lightblue';
	c.fillRect(0, 0, innerWidth, innerHeight);
}
function start() {
	gameInt(estadoDelJuego);
	c.clearRect(0, 0, innerWidth, innerHeight); // Esto limpia el rastro del circulo cada vez que se ejecuta la funcion.
	if (estadoDelJuego == 'PLAY') {
		snakeInit();
		foodInit();
	}
}
function gameLoop() {
	requestAnimationFrame(gameLoop);

	gameDraw();
	drawScore();
	if (pause == true) {
		snakeUpdate();
	}
	snakeDraw(rgb);
	foodDraw();
	// backgroundSound.play();
}
function gameStart() {
	gameInt('PLAY');

	start();
	gameLoop();
}
snake = [];
function snakeInit() {
	snake = [];
	snakeLength = 5;
	snakeSize = 20;
	snakeDir = 'down';

	for (var i = snakeLength - 1; i >= 0; i--) {
		snake.push({
			x: i,
			y: 15
		});
	}
}

function snakeDraw(color) {
	for (var i = 0; i < snake.length; i++) {
		if (snakeCustume == 1) {
			c.fillStyle = color;
			c.fillRect(snake[i].x * snakeSize, snake[i].y * snakeSize, snakeSize, snakeSize);
			c.fillStyle = 'rgb(87,99,169)';
			c.fillRect(snake[0].x * snakeSize, snake[0].y * snakeSize, snakeSize, snakeSize);
		}

		foodShape = '⬛️';
		c.font = '20px monospace ';
		c.fillText(foodShape, snake[i].x * snakeSize, snake[i].y * snakeSize);

		if (snakeDir == 'right') foodShape = '▶️';
		if (snakeDir == 'left') foodShape = '◀️';
		if (snakeDir == 'up') foodShape = '🔼';
		if (snakeDir == 'down') foodShape = '🔽';

		c.font = '20px monospace ';
		c.fillText(foodShape, snake[0].x * snakeSize, snake[0].y * snakeSize);

		if (snakeCustume == 2) {
			c.beginPath();
			c.fillStyle = color;
			c.arc(snake[i].x * snakeSize, snake[i].y * snakeSize, 10, 0, Math.PI * 2);
			c.fill();

			c.beginPath();
			c.arc(snake[0].x * snakeSize, snake[0].y * snakeSize, 10, 0, Math.PI * 2);
			c.fillStyle = 'red';
			c.fill();

			c.beginPath();
			c.arc(snake[0].x * snakeSize, snake[0].y * snakeSize + 8, 3, 0, Math.PI * 2);
			c.fillStyle = color;
			c.fill();
			c.beginPath();
			c.arc(snake[0].x * snakeSize, snake[0].y * snakeSize - 8, 3, 0, Math.PI * 2);
			c.fillStyle = color;
			c.fill();
		}
	}
}

function snakeUpdate() {
	snakeHeadX = snake[0].x;
	snakeHeadY = snake[0].y;
	snakeSpeed = 0.5;

	if (snakeDir == 'left') snakeHeadX -= snakeSpeed;
	if (snakeDir == 'right') snakeHeadX += snakeSpeed;
	if (snakeDir == 'down') snakeHeadY += snakeSpeed;
	if (snakeDir == 'up') snakeHeadY -= snakeSpeed;

	checkFoodCollisions();
	checkWallCollisions();
	snakeCollisioItself();

	snakeTail = snake.pop();
	snakeTail.x = snakeHeadX;
	snakeTail.y = snakeHeadY;

	snake.unshift(snakeTail);
	// document.addEventListener('keyup', function(event) {
	// 	if (event.keyCode == '32' && pause == true) {
	// 		pause = false;
	// 	}
	// });
}

food = {
	x: 0,
	y: 0
};
function foodInit() {
	food = {
		x: 0,
		y: 0
	};
	setFoodPos();
}

function foodDraw() {
	foodShape = '🥩';
	c.font = '25px monospace ';
	c.fillText(foodShape, food.x * snakeSize, food.y * snakeSize);

	if (snakeCustume == 1) {
		c.fillStyle = 'red';
		c.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
	}

	if (snakeCustume == 2) {
		c.beginPath();
		c.arc(food.x * snakeSize, food.y * snakeSize, 10, 0, Math.PI * 2);
		c.strokeStyle = 'red';
		c.fillStyle = 'red';
		foodShape = '🍔';

		c.font = '25px monospace ';
		c.fillText(foodShape, food.x * snakeSize, food.y * snakeSize);
		c.fill();
	}
}
function getDistance(x1, y1, x2, y2) {
	var xDistance = x2 - x1;
	var yDistance = y2 - y1;

	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
function setFoodPos() {
	var randomX = Math.floor(Math.random() * innerWidth);
	var randomY = Math.floor(Math.random() * innerHeight);

	food.x = Math.floor(randomX / snakeSize);
	food.y = Math.floor(randomY / snakeSize);
}
function instruction() {
	setState('INSTRUCTIONS');
}
function setting() {
	setState('SETTING');
}

function goBack() {
	setState('HOME');
}
function pauseOff() {
	if (pause == false) {
		pause = true;
		reboundAudio.play();
		closeMenu(pauseMenu);
	}
}
function goHome() {
	window.location.reload();
}
function gameRestart() {
	snakeInit();
	setState('PLAY');
	score = 0;
	life = 3;
	// backgroundAudio.currentTime = 0;
	// backgroundAudio.play();
	// gameoverAudio.pause();
	// gameoverAudio.currentTime = 0;
	// homeMenuAudio.pause();
}
function keyboardHanler(event) {
	if (event.keyCode == '37' && snakeDir != 'right') {
		snakeDir = 'left';
	}
	if (event.keyCode == '38' && snakeDir != 'down') {
		snakeDir = 'up';
	}
	if (event.keyCode == '39' && snakeDir != 'left') {
		snakeDir = 'right';
	}
	if (event.keyCode == '40' && snakeDir != 'up') {
		snakeDir = 'down';
	}
}
function paused(event) {
	if (event.keyCode == '32') {
		pause = false;
		homeMenuAudio.pause();
	}
	if (pause == false) {
		setState('PAUSE');
	} else {
		closeMenu(pauseMenu);
	}
}
function checkFoodCollisions() {
	// if (snake[0].x == food.x && snake[0].y == food.y) {
	// 	score += 1;

	// 	snake.push(food);
	// 	foodInit();
	// 	foodDraw();
	// }

	if (getDistance(snakeHeadX, snakeHeadY, food.x, food.y) <= 1) {
		score += 1;

		reboundAudio.play();
		snake.push(food);
		foodInit();
		foodDraw();
	}
}
function checkWallCollisions() {
	if (easyMode.checked == true) {
		if (
			snakeHeadX * snakeSize >= innerWidth ||
			snakeHeadX * snakeSize < 0 ||
			snakeHeadY * snakeSize >= innerHeight ||
			snakeHeadY * snakeSize < 0
		) {
			life -= 1;

			snakeHeadX = 20;
			snakeHeadY = 17;
			snakeDir = '';
		}

		if (life == 0) {
			setState('GAME OVER');
			pause = false;
		}
	}
	if (hardMode.checked == true) {
		if (snakeHeadX * snakeSize >= innerWidth) {
			snakeHeadX = 1;
		}
		if (snakeHeadY * snakeSize >= innerHeight) {
			snakeHeadY = 1;
		}
		if (snakeHeadX * snakeSize < 0) {
			snakeHeadX = 67;
		}
		if (snakeHeadY * snakeSize < 0) {
			snakeHeadY = 33;
		}
	}
}

function snakeCollisioItself() {
	for (let i = 1; i < snake.length; i++) {
		if (snakeHeadX == snake[i].x && snakeHeadY == snake[i].y) {
			life -= 1;

			return;
		}
	}
}

function setState(estado) {
	estadoDelJuego = estado;
	showMenu(estado);
}
function displayMenu(menu) {
	menu.style.visibility = 'visible';
}

function closeMenu(menu) {
	menu.style.visibility = 'hidden';
}

function centerMenuPosition(menu) {
	menu.style.top = canvas.height / 2 - menu.offsetHeight / 2 + 'px';
	menu.style.left = canvas.width / 2 - menu.offsetWidth / 2 + 'px';
}

function drawScore() {
	scoreboard.innerHTML = 'SCORE: <i>' + score + '</i>';
	lifeboard.innerHTML = 'LIFE : <i>' + life + '</i>';
	finalScore.innerHTML = 'Tu SCORE es : ' + score;
}

function showMenu(estado) {
	if (estado == 'GAME OVER') {
		displayMenu(gameOverMenu);
		centerMenuPosition(gameOverMenu);
	}
	if (estado == 'PLAY') {
		closeMenu(homeMenu);
		closeMenu(gameOverMenu);

		displayMenu(scoreboardMenu);
		displayMenu(lifeMenu);
	}
	if (estado == 'HOME') {
		displayMenu(homeMenu);
		centerMenuPosition(homeMenu);

		closeMenu(gameOverMenu);
		closeMenu(instructionMenu);
		closeMenu(settingMenu);
	}
	if (estado == 'INSTRUCTIONS') {
		displayMenu(instructionMenu);
		centerMenuPosition(instructionMenu);

		closeMenu(homeMenu);
	}
	if (estado == 'PAUSE') {
		displayMenu(pauseMenu);
		centerMenuPosition(pauseMenu);
	}
	if (estado == 'SETTING') {
		displayMenu(settingMenu);
		centerMenuPosition(settingMenu);

		closeMenu(homeMenu);
	}
}

$(document).ready(function() {
	$('input[type="checkbox"]').change(function() {
		if ($(this).is(':checked')) {
			$('input[type="checkbox"]').not(this).prop('checked', false);
		}
	});
});
