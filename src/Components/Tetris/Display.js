import React from 'react';
import styled from 'styled-components';

const Display = ({ gameOver, text }) => (
    <StyledDisplay>{text}</StyledDisplay>
)

    //color: linear-gradient(0deg, rgba(52,75,110,0.5970763305322129) 0%, rgba(178,190,236,0.5326505602240896) 50%, rgba(10,129,238,1) 100%);
const StyledDisplay = styled.div`
    width: 250px;
    margin: 20px 25px;
    padding: 10px;
    font-size: 35px;
    background: -webkit-linear-gradient(#a5b5f2, #91a6f6, #a6d4ff);
    background-clip: inherit;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    box-shadow: inset 0px 0px 16px -9px rgba(0,0,0,0.75);
    border-radius: 5px;
`;

export default Display;