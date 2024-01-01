import { preloadImages } from "./preload.js"

const mainLayer = document.querySelector('#main-layer').getContext('2d');
const animLayer = document.querySelector('#anim-layer').getContext('2d');
const bgLayer = document.querySelector('#bg-layer').getContext('2d');
const uiLayer = document.querySelector('#ui-layer').getContext('2d');

let width = 320,
    height = 180;

let tileSize = 8;
let textures = await preloadImages()

// [start, pause, run, gameover];
let gameState = "start";

function setGameState(state) {
    gameState = state;
}

export {
    mainLayer, bgLayer, animLayer, uiLayer,
    width, height, tileSize,
    textures,
    gameState,
    setGameState
}