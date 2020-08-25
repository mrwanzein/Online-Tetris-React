import React, { useState } from 'react';
import styled from 'styled-components';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton'

import { createStage } from './gameHelpers';
import { usePlayer} from './hooks/usePlayer';
import { useStage } from './hooks/useStage';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer] = usePlayer();
    const [stage, setStage] = useStage(player, resetPlayer);

    console.log("re-render")
    
    const movePlayer = (direction) => {
        updatePlayerPos({ x: direction, y: 0 });
    }

    const startGame = () => {
        // Resets everything
        setStage(createStage());
        resetPlayer();
    }

    const drop = () => {
        updatePlayerPos({ x: 0, y: 1, collided: false });
    }

    const dropPlayer = () => {
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
            }
        }
    }

    return(
        <InputWrapper role="button" tabIndex="0" onKeyDown={e => move(e)}>
            <TetrisStage>
                <Stage stage={stage} />
                <aside>
                    {
                        gameOver ? <span>Game Over!</span> : 
                        <div>
                            <Display text="Score" />
                            <Display text="Rows" />
                            <Display text="Level" />
                        </div>
                    }
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

export default Tetris;