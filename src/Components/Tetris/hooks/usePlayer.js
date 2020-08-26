import { useState, useCallback } from 'react';

import { TETROMINOS, randomTetromino } from '../gameHelpers/tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0},
        tetromino: TETROMINOS[0].shape,
        collided: false,
    });

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: prev.pos.x += x,  y: prev.pos.y += y},
            collided
        }));
    }

    const rotate = (matrix, direction) => {
        // Transpose the rows to become columns
        /*
        
        Example: 
        
        from
        
        [
            [0, 'L', 0],
            [0, 'L', 0],
            [0, 'L', 'L']
        ]

        to

        [
            [0, 0, 0],
            ['L', 'L', 'L'],
            [0, 0, 'L']
        ]
        
        */ 
        const rotatedTetro = matrix.map((_, index) => {
            return matrix.map(col => col[index]);
        });

        // Then reverse each row depending on the desired direction
        if(direction > 0) {
            return rotatedTetro.map(row => row.reverse());
        } else {
            return rotatedTetro.reverse();
        }
        
    }

    const playerRotate = (stage, direction) => {
        // To avoid mutating the player state
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, direction);
        
        // Simulating left and right movement until collision to check if we can rotate
        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while(checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if(offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -direction);
                clonedPlayer.pos.x = pos;
                return;
            }
        }
        setPlayer(clonedPlayer);
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: (STAGE_WIDTH / 2) - 2, y: 0 },
            tetromino: randomTetromino().shape,
            collided: false
        });
    }, [])

    return [player, updatePlayerPos, resetPlayer, playerRotate];
}