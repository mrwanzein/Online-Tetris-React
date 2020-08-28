import React from 'react';
import styled from 'styled-components';

import Tetris from '../Tetris';
import { GameContext } from '../GameContext';

const Homepage = () => {
    const {socket} = React.useContext(GameContext);

    
    return(
        <>
            <Tetris />
        </>
    )
}

export default Homepage;