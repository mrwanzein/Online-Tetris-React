import React from 'react';
import styled from 'styled-components';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton'

import { createStage } from './gameHelpers';

const Tetris = ({ callback }) => {
    return(
        <TetrisStage>
            <Stage stage={createStage()} />
            <aside>
                <div>
                    <Display text="Score" />
                    <Display text="Rows" />
                    <Display text="Level" />
                </div>
                <StartButton />
            </aside>
        </TetrisStage>
    )
}

const TetrisStage = styled.div`
    display: flex;
    
    aside {
        margin-left: 20px;
    }
`;

export default Tetris;