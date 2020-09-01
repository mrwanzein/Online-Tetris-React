import React, { useState } from 'react';
import styled from 'styled-components';

import { GameContext } from '../GameContext';
import { GameContextWithoutSocketTrigger } from '../GameContextWithoutSocketTriggerProvider';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

import { createStage, checkCollision } from './gameHelpers';
import { tetrominoArr } from './gameHelpers/tetrominos';
import { usePlayer} from './hooks/usePlayer';
import { useStage } from './hooks/useStage';
import { useInterval } from './hooks/useInterval';
import { useGameStatus } from './hooks/useGameStatus';

import O from '../../assets/O.png';
import I from '../../assets/I.png';
import J from '../../assets/J.png';
import L from '../../assets/L.png';
import S from '../../assets/S.png';
import T from '../../assets/T.png';
import Z from '../../assets/Z.png';

let tetrominoImages = {O, I, J, L, S, T, Z};

const Tetris = ({ inBattle, waitingForChallenger, setWaitingForChallenger, opponent, setGetReady }) => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
    const [canStartDuel, setCanStartDuel] = React.useState(false);
    const [startedDuel, setStartedDuel] = React.useState(false);

    const { socket } = React.useContext(GameContext);
    const { localUser } = React.useContext(GameContextWithoutSocketTrigger);

    useInterval(() => {
        if(opponent && gameStarted) {
            socket.on('opponentLost?', (opponentHasLost, gamestarted, dropTime) => {
                if(opponentHasLost) {
                    setGameOver(true);
                    setGameStarted(gamestarted);
                    setDropTime(dropTime);
                }
            });
            socket.on('receiveOpponentFieldInfo', (oppInfo, score, rows, level) => {
                player.tetromino = oppInfo.tetromino;
                player.pos = oppInfo.pos;
                player.collided = oppInfo.collided;
                setScore(score);
                setLevel(level);
                setRows(rows);
            });
        }
    }, 200);

    React.useEffect(() => {
        socket.on('opponentReady', (res) => {
            if(setWaitingForChallenger) {
                setWaitingForChallenger(res);
            }
        });

        socket.on('checkIfBothPlayerReady', (res) => {
            if(!canStartDuel && !startedDuel) {
                setCanStartDuel(res);
                if(setGetReady !== undefined) {
                    setGetReady(false);
                }
            }
        });

        return () => {
            socket.off('opponentReady');
            socket.off('checkIfBothPlayerReady');
        }
    }, [socket, setWaitingForChallenger, canStartDuel, setCanStartDuel, startedDuel, setGetReady]);

    useInterval(() => {
        if(!canStartDuel && !startedDuel) {
            socket.emit('checkIfBothPlayerReady');
        }
    }, 4000)

    const movePlayer = (direction) => {
        if(!checkCollision(player, stage, {x: direction, y: 0})) {
            updatePlayerPos({ x: direction, y: 0 });
        }
    }

    const startGame = () => {
        // Resets everything
        if(!canStartDuel && inBattle) {
            socket.emit('ready', localUser);
        } else if(!canStartDuel && !inBattle) {
            setStage(createStage());
            setDropTime(1000);
            resetPlayer();
            setGameStarted(true);
            setGameOver(false);
            setScore(0);
            setRows(0);
            setLevel(1);
        }
    }

    const drop = (fullDrop = 1, fromFullDrop = false) => {
        // Increase level when player has cleared 10 rows
        if(rows > (level * 10)) {
            setLevel(prev => prev + 1);
            setDropTime(1000 - (level > 1 ? 50 * level : 0));
        }
        
        if(!checkCollision(player, stage, {x: 0, y: 1})) {
            updatePlayerPos({ x: 0, y: fullDrop, collided: false, fromFullDrop });
        } else {
            // Checking if a tetromino is overflowing the top of the stage
            if(player.pos.y < 1) {
                if(gameStarted && !opponent) {
                    socket.emit('opponentLost?', true, false, null);
                }
                setGameOver(true);
                setGameStarted(false);
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

    const checkIfOneOfPlayerSquaresIsAlignedOverMergedCell = (cellXPos, player) => {
        // Check if a player tetromino and it' s aligned over a merged tetromino
        for(let i=0; i<player.tetromino.length; i++) {
            for(let j=0; j<player.tetromino.length; j++) {
                if(cellXPos === player.pos.x + i && stage[player.pos.y + j][player.pos.x + i][0] !== 0) return true;
            }
        }
    }

    const getRotatedLengthOfTetromino = () => {
        let flag = player.tetromino.map(row => {
            return row.every(cell => cell === 0);
        });
        // if -1 it means not rotated
        return flag.indexOf(true) === -1 ? true : false;
    }

    const fullDrop = () => {
        let heightOfNextMerged = 0;

        for(let i=0; i<stage.length; i++){
            let flag = false;
            
            for(let j=0; j<stage[i].length; j++){
                if(stage[i][j][1] === 'merged' && checkIfOneOfPlayerSquaresIsAlignedOverMergedCell(j, player)){
                    heightOfNextMerged = i - (getRotatedLengthOfTetromino() ? player.tetromino.length : player.tetromino.length - 1);
                    flag = true;
                    break;
                } else {
                    heightOfNextMerged = 20 - player.tetromino.length;
                }
            }
            if(flag) break;
        }
        

        setDropTime(null);
        drop(heightOfNextMerged, true);
        setDropTime(1000 - (level > 1 ? 50 * level : 0));
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
            } else if(keyCode === 32) {
                fullDrop();
            }
        }
    }

    useInterval(() => {
        drop();
    }, dropTime);
    
    if(canStartDuel && !startedDuel) {
        setStartedDuel(true);        
        setCanStartDuel(false);
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(1);
    }
    
    useInterval(() => {
        if(gameStarted && !opponent) {
            socket.emit('sendLocalFieldInfoToOpp', player, score, rows, level);
        }
    }, 200)

    return(
        <InputWrapper id="controller" role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={e => keyUp(e)}>
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
                                    { 
                                        gameStarted ? 
                                        <NextDisplay>
                                            <NextHeader>Next</NextHeader>
                                            <img style={{display: "block", margin: "0 auto"}} src={tetrominoImages[tetrominoArr[1][1]]} alt={`${tetrominoArr[0][1]} tetromino`}/>
                                        </NextDisplay> : 
                                        ""
                                    }
                                </>
                        }
                    </div>
                    
                    <StartButton 
                        callback={startGame} 
                        inBattle={inBattle}
                        waitingForChallenger={waitingForChallenger}
                    />
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
    background-color: #dfeffd;
    
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

const NextDisplay = styled.div`
    border: 2px solid black;
    background-color: white;
`;

const NextHeader = styled.div`
    font-family: 'Press Start 2P', cursive;
    background-color: rgb(248, 248, 248);
    text-align: center;
    font-size: 1.1em;
    padding: 5px 0;
`;

export default Tetris;