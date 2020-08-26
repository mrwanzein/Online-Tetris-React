import React, { useState } from 'react';
import styled from 'styled-components';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton'

import { createStage, checkCollision } from './gameHelpers';
import { usePlayer} from './hooks/usePlayer';
import { useStage } from './hooks/useStage';
import { useInterval } from './hooks/useInterval';
import { useGameStatus } from './hooks/useGameStatus';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    const movePlayer = (direction) => {
        if(!checkCollision(player, stage, {x: direction, y: 0})) {
            updatePlayerPos({ x: direction, y: 0 });
        }
    }
    const startGame = () => {
        // Resets everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(1);
    }

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if(rows > (level * 10)) {
            setLevel(prev => prev + 1);
            setDropTime(1000 - (level > 1 ? 50 * level : 0));
        }

        if(!checkCollision(player, stage, {x: 0, y: 1})) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Checking if a tetromino is overflowing the top of the stage
            if(player.pos.y < 1) {
                console.log("GAME OVER!!");
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    }

    const keyUp = ({ keyCode }) => {
        if(!gameOver && keyCode === 40) {
            // Re-activates useInterval when user finished active tetromino dropping
            setDropTime(1000 - (level > 1 ? 50 * level : 0));
        }
    }

    const dropPlayer = () => {
        // Stop useInterval to avoid interference with active tetromino dropping
        setDropTime(null);
        drop();
    }

    const move = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 37) {
                movePlayer(-1);
            } else if(keyCode === 39) {
                movePlayer(1);
            } else if(keyCode === 40) {
                dropPlayer();
            } else if(keyCode === 65) {
                playerRotate(stage, -1);
            } else if(keyCode === 70) {
                playerRotate(stage, 1);
            }
        }
    }

    useInterval(() => {
        drop();
    }, dropTime);

    return(
        <InputWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={e => keyUp(e)}>
            <TetrisStage>
                <Stage stage={stage} />
                <aside>
                    <div>
                        {
                            gameOver ? 
                                <>
                                <GameOver>Game Over!</GameOver>
                                </>
                                :
                                <>
                                <Display text={`Score: ${score}`} />
                                <Display text={`Rows: ${rows}`} />
                                <Display text={`Level: ${level}`} />
                                </>
                        }
                    </div>
                    <StartButton callback={startGame}/>
                </aside>
            </TetrisStage>
        </InputWrapper>
    )
}

const TetrisStage = styled.div`
    display: flex;
    
    aside {
        margin-left: 20px;
        display: flex;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 80px);
    
    &:focus {
        outline: none;
    }
`;

const GameOver = styled.span`
    display: block;
    margin-bottom: 100px;
    font-size: 3em;
    color: red;
`;

export default Tetris;