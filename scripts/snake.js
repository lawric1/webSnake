import { textures, mainLayer, width, height, gameState } from "./globals.js";
import { isActionJustPressed } from "./input.js";

const tileSize = 8;
const snakeTileset = {
    headLeft: [24, 0],
    headRight: [32, 0],
    headUp: [24, 8],
    headDown: [32, 8],
    midHorizontal: [0, 0],
    midVertical: [0, 8],
    cornerTopLeft: [8, 0],
    cornerTopRight: [16, 0],
    cornerBottomLeft: [8, 8],
    cornerBottomRight: [16, 8],
    tailTop: [0, 16],
    tailBottom: [0, 24],
    tailLeft: [8, 16],
    tailRight: [16, 16]
};

export class Snake {
    constructor(fps) {
        this.frameInterval = 1000 / fps;
        
        this.body = [{x: 21, y: 11}, {x: 20, y: 11}];
        this.head = {x: 21, y: 11};
        this.direction = {x: 1, y: 0};
        
        this.lastFrameTime = 0;

        this.dead = false;
        this.canMove = true;
    }

    initialize() {
        this.update();
    }

    update() {
        if (this.canMove === false) { return; }

        this.handleInput();

        const currentTime = performance.now();
        const elapsedTime = currentTime - this.lastFrameTime;
        if (elapsedTime >= this.frameInterval) {
            if (gameState === "run") {
                this.moveSnake();
                this.drawSnake();
            }
            this.lastFrameTime = currentTime;
        }

        requestAnimationFrame(this.update.bind(this));
    }
    
    handleInput() {
        if (isActionJustPressed("moveUp")) {
            this.setDirection({x: 0, y: -1});
        }
        else if (isActionJustPressed("moveDown")) { 
            this.setDirection({x: 0, y: 1});
        }
        else if (isActionJustPressed("moveLeft")) { 
            this.setDirection({x: -1, y: 0});
        }
        else if (isActionJustPressed("moveRight")) { 
            this.setDirection({x: 1, y: 0});
        }
    }

    setDirection(newDirection) {
        if (this.direction.x + newDirection.x === 0 && this.direction.y + newDirection.y === 0) {
            return;
        }

        this.direction = newDirection;
    }

    moveSnake() {
        const newHead = {
            x: this.head.x + this.direction.x,
            y: this.head.y + this.direction.y
        };

        // Check for collision with boundaries or self
        if (this.checkCollision()) {
            this.dead = true;
            this.canMove = false;
            return;
        }
        

        this.body.unshift(newHead);
        this.body.pop();
        this.head = newHead;
    }

    checkCollision() {
        let snakeBody = this.body.slice(1);
        let itSelf = false;

        for (const segment of snakeBody) {
            if (segment.x === this.head.x && segment.y === this.head.y) {
                itSelf = true;
                break;
            }
        }

        let rightWall = this.head.x >= 38 && this.direction.x === 1;
        let leftWall = this.head.x <= 1 && this.direction.x === -1;
        let bottomWall = this.head.y >= 20 && this.direction.y === 1;
        let topWall = this.head.y <= 1 && this.direction.y === -1;
    
        let collissionDetected = rightWall || leftWall || bottomWall || topWall || itSelf;
    
        return collissionDetected;
    }

    increaseSize() {
        // To increase the size, simply add a new tail segment at the end of the snake
        const tail = this.body[this.body.length - 1];
        const newTail = { x: tail.x, y: tail.y };
        this.body.push(newTail);
    }

    drawSnake() {
        mainLayer.clearRect(0, 0, width, height);
        
        this.drawSnakeHead();
        for (let i = 1; i < this.body.length; i++) {
            this.drawSnakePart(this.body[i], i);
        }
    }

    drawSnakeHead() {
        let headTile;
        if (this.direction.x === 1) headTile = "headRight";
        else if (this.direction.x === -1) headTile = "headLeft";
        else if (this.direction.y === -1) headTile = "headUp";
        else if (this.direction.y === 1) headTile = "headDown";

        this.drawTile(headTile, this.head);
    }

    drawSnakePart(part, i) {
        const prev = this.body[i - 1];
        const next = this.body[i + 1];
    
        if (prev && next) {
            const isHorizontal = prev.y === part.y && next.y === part.y;
            const isVertical = prev.x === part.x && next.x === part.x;
    
            if (isHorizontal) {
                this.drawTile("midHorizontal", part);
            } else if (isVertical) {
                this.drawTile("midVertical", part);
            } else {
                // Determine the corner based on the relative positions of left and right
                let prevSouth = prev.x === part.x && prev.y > part.y;
                let prevNorth = prev.x === part.x && prev.y < part.y;
                let prevWest = prev.x < part.x && prev.y === part.y;
                let prevEast = prev.x > part.x && prev.y === part.y;
                
                let nextSouth = next.x === part.x && next.y > part.y
                let nextNorth = next.x === part.x && next.y < part.y;
                let nextWest = next.x < part.x && next.y === part.y;
                let nextEast = next.x > part.x && next.y === part.y;
                
                let topLeft = prevSouth && nextEast || prevEast && nextSouth;
                let topRight = prevWest && nextSouth || prevSouth && nextWest;
                let bottomLeft = prevEast && nextNorth || prevNorth && nextEast;
                let bottomRight = prevWest && nextNorth || prevNorth && nextWest;

                if (topLeft) {
                    this.drawTile("cornerTopLeft", part);
                } else if (topRight) {
                    this.drawTile("cornerTopRight", part);
                } else if (bottomLeft) {
                    this.drawTile("cornerBottomLeft", part);
                } else if (bottomRight) {
                    this.drawTile("cornerBottomRight", part);
                }
            }
        } else if (prev) {
            let tailLeft = prev.x > part.x;
            let tailRight = prev.x < part.x;
            let tailTop = prev.y > part.y;
            let tailBottom = prev.y < part.y;
    
            if (tailLeft) { this.drawTile("tailLeft", part); }
            else if (tailRight) { this.drawTile("tailRight", part); }
            else if (tailTop) { this.drawTile("tailTop", part); }
            else if (tailBottom) { this.drawTile("tailBottom", part); }
        }
    }    

    drawTile(partName, position) {
        const [x, y] = snakeTileset[partName];
        mainLayer.drawImage(textures.snake, x, y, tileSize, tileSize, position.x * tileSize, position.y * tileSize, tileSize, tileSize);
    }
}
