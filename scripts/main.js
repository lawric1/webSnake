import { 
    textures, 
    mainLayer, animLayer, bgLayer,
    width, height, 
    gameState, setGameState  
} from "./globals.js";
import { delay } from "./utils.js";
import { IsActionReleased, isActionJustPressed } from "./input.js";
import { Snake } from "./snake.js";
import { Food } from "./food.js";


let snake;
let food;

let justConsumed = false;


function initialize() {
    snake = new Snake(8);
    food = new Food(10, 10);
    food.respawn(snake.body);
}

// Update

function handleFoodEaten() {
    if (justConsumed) { return; }

    snake.increaseSize();
    
    justConsumed = true;

    food.respawn(snake.body);
}
function update() {
    if (snake.dead) {
        delay(1000).then(() => {
            setGameState("gameover");
        });
    }

    // Check if snake head pos is the same as the food
    // Wait a bit so that the detection doesn't happen multiple times
    if (snake.head.x === food.x && snake.head.y === food.y) {
        handleFoodEaten();
        delay(125).then(() => {
            justConsumed = false;
        });
    }
}

// Draw

function drawStart() {
    mainLayer.drawImage(textures.start, 0, 0);
}
function drawPause() {
    mainLayer.drawImage(textures.pause, 0, 0);
}
function drawGameOver() {
    mainLayer.drawImage(textures.gameover, 0, 0);
    animLayer.clearRect(0, 0, width, height);
}

function renderGame(timestamp) {
    if (gameState === "start") { drawStart(); }
    else if (gameState === "pause") { drawPause(); }
    else if (gameState === "gameover") { drawGameOver(); }
    else if (gameState === "run") { 
        update(); 
    }

    // Handle States
    if (isActionJustPressed("pause")) {
        if (gameState === "run") { 
            setGameState("pause");
        }
        else if (gameState === "pause") {
            setGameState("run");
        }
    } 
    else if (IsActionReleased("start") && gameState === "start") {
        setGameState("run");
        initialize();
        snake.initialize();
    }
    else if (IsActionReleased("restart") && gameState === "gameover") { 
        setGameState("start"); 
    }

    
    requestAnimationFrame(renderGame);
}


function renderBackground() {
    bgLayer.drawImage(textures.bg, 0, 0);
}


let animInterval = 100;
let lastAnimTime = 0;
function renderFood(timestamp) {
    let elapsed = timestamp - lastAnimTime;

    if (elapsed > animInterval && gameState === "run") {
        food.update();

        lastAnimTime = timestamp;
    }

    requestAnimationFrame(renderFood);
}

renderBackground();
renderGame();
renderFood();