export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () => {
    return Array.from(Array(STAGE_HEIGHT), () => {
        return new Array(STAGE_WIDTH).fill([0, 'clear']);
    });
}

export const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
    for(let y = 0; y < player.tetromino.length; y++){
        for(let x = 0; x < player.tetromino[y].length; x++){
            // Check if we're on a tetromino cell
            if(player.tetromino[y][x] !== 0) {
                if(
                // Check if a move doesn't go beyond the bottom of the stage
                !stage[y + player.pos.y + moveY] ||
                
                // Check if a move will go beyond the stage width
                !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
                
                // Check if a tetromino is going to collide with another tetromino
                stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
                
                ) {
                    return true;
                }
            }
        }
    }
}