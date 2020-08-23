import React from 'react';
import styled from 'styled-components';

import Cell from './Cell';

const Stage = ({ stage }) => (
    <StyledStage height={stage.length} width={stage[0].length}>
        {
            stage.map(row => 
                row.map((cell, x) => <Cell key={x} type={cell[0]} />)
                )
        }
    </StyledStage>
)

// The calc is to keep a nice aspect ratio
const StyledStage = styled.div`
    display: grid;
    grid-template-rows: repeat(${props => props.height}, calc(20vw / ${props => props.width}));
    grid-template-columns: repeat(${props => props.width}, 1fr);
    grid-gap: 1px;
    border: 2px solid #333;
    width: 900px;
    max-width: 25vw;
    background-color: #111;
`;

export default Stage;