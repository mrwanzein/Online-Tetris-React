import React from 'react';
import styled from 'styled-components';

import { GameContext } from '../GameContext';

import Tetris from '../Tetris';

const Battle_Area = () => {
    const { socket } = React.useContext(GameContext);
    const [getReady, setGetReady] = React.useState(false);

    React.useEffect(() => {
        socket.on('readyUp', (res) => {
            setGetReady(true);
        });

        return () => {
            socket.off('readyUp');
        }
    }, [socket])
    
    return(
        <>
            {getReady ? <ReadyMsg>Please get ready!</ReadyMsg> : ""}
            <Wrapper>
                <Tetris inBattle={true}/>
                <Tetris inBattle={true}/>
            </Wrapper>
        </>
    )
}

export default Battle_Area;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-around;
    background-color: #dfeffd;
`;

const ReadyMsg = styled.div`
    font-size: 1.5em;
    font-family: 'Press Start 2P', cursive;
    text-align: center;
    padding: 20px 0;
    background-color: royalblue;
`;