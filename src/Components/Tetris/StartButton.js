import React from 'react';
import styled from 'styled-components';

const StartButton = ({ callback }) => (
    <StyledStartButton onClick={callback}>Start Game</StyledStartButton>
)

const StyledStartButton = styled.button`
	padding: 10px 40px;
    margin: 0px 10px 10px 0px;
	border-radius: 10px;
	font-size: 20px;
	color: #FFF;
	text-decoration: none;
    transition: all 0.1s;
    background-color: #3498DB;
	border-bottom: 5px solid #2980B9;
	text-shadow: 0px -2px #2980B9;
    cursor: pointer;

    &:active {
        transform: translate(0px,5px);
	    border-bottom: 1px solid;
    }

    &:focus {
        outline: none;
        border-color: blue;
        box-shadow: 0 0 5px 0 rgb(64, 64, 245);
    }
`;

export default StartButton;