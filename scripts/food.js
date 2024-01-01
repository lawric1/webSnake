import { textures, animLayer, width, height, tileSize, gameState } from "./globals.js";
import { randomInt } from "./utils.js";

export class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.maxFrame = 3
        this.currentFrame = 0;
        this.isPlaying = false;
    }

    update() {
        this.draw(this.currentFrame)
        this.currentFrame++;

        if (this.currentFrame === this.maxFrame) { this.currentFrame = 0; }
    }

    draw() {
        animLayer.clearRect(0, 0, width, height);
        animLayer.drawImage(
            textures.food1, 
            this.currentFrame * tileSize, 0,
            tileSize, tileSize * 2,
            this.x * tileSize, this.y * tileSize - 8,
            tileSize, tileSize * 2
        );
    }

    respawn(snakeBody) {
        let currentPos = { x: this.x, y: this.y };
        let isInsideSnake = true;
    
        while (isInsideSnake) {
            currentPos.x = randomInt(1, 38);
            currentPos.y = randomInt(1, 20);
    
            isInsideSnake = false;
            for (let i = 0; i < snakeBody.length; i++) {
                let part = snakeBody[i];
                if (currentPos.x === part.x && currentPos.y === part.y) {
                    isInsideSnake = true;
                    break;
                }
            }
        }
    
        this.x = currentPos.x;
        this.y = currentPos.y;
    }

    render() {
        
    }
}