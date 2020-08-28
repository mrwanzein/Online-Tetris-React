import React from 'react';
import styled from 'styled-components';

import Tetris from '../Tetris';
import { SocketContext } from '../SocketContext';

const Homepage = () => {
    const {socket} = React.useContext(SocketContext);

    
    return(
        <>
            <Tetris />
        </>
    )
}

export default Homepage;