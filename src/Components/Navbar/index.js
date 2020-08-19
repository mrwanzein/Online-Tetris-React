import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const Navbar = () => {
    return(
        <Wrapper>
            <NavTitle exact to="/" activeClassName="title">Ultimate Tetris Mania</NavTitle>
            <NavATags exact to="/register">Register</NavATags>
            <NavATags exact to="/login">Log in</NavATags>
        </Wrapper>
    )
}

const cycleTetrisColors = keyframes`
    0% {
        color: cyan;
    }
    
    12.5% {
        color: yellow;
    }

    25% {
        color: purple;
    }

    37.5% {
        color: lightgreen;
    }

    50% {
        color: blue;
    }

    62.5% {
        color: red;
    }

    75% {
        color: orange;
    }

    100% {
        color: white;
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 80px;
    background-color: lightcoral;

    .active {
        border-bottom: 2px solid white;
    }

`;

const NavATags = styled(NavLink)`
    background-color: rgb(219, 92, 83);
    margin: 0 20px;
    padding: 10px 20px;
    color: white;

    &:hover {
        background-color: rgb(219, 117, 110);
    }
`;

const NavTitle = styled(NavLink)`
    margin-right: auto;
    margin-left: 85px;
    font-size: 1.8em;
    color: white;
    font-weight: bold;
    font-style: italic;
    text-shadow: 4px 4px 0px #FF0000;
    animation: ${cycleTetrisColors} 3s;
`;

export default Navbar;