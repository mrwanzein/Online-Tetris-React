import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import { GameContextWithoutSocketTrigger } from '../GameContextWithoutSocketTriggerProvider';

const Navbar = () => {
    const { localUser } = React.useContext(GameContextWithoutSocketTrigger);
    
    return(
        <Wrapper>
            <NavTitle exact to="/" activeClassName="title">Ultimate Tetris Mania</NavTitle>
            { localUser ? null :  <NavATags exact to="/register">Register</NavATags> }
            { localUser ? <LogOut onClick={() => window.location.reload()}>Log out</LogOut> : <NavATags exact to="/login">Log in</NavATags> }
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
        text-shadow: 4px 4px 0px white;
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
        border-left: 2px solid white;
    }

`;

const NavATags = styled(NavLink)`
    background-color: rgb(219, 92, 83);
    margin: 0 20px;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;

    &:hover {
        background-color: rgb(219, 117, 110);
    }
`;

const LogOut = styled.button`
    background-color: rgb(219, 92, 83);
    margin: 0 20px;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    cursor: pointer;

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