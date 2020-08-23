import React from 'react';
import styled from 'styled-components';

import Tetris from '../Tetris';

const Homepage = () => {
    return(
        <Wrapper>
            <Tetris />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 80px);
`;

export default Homepage;