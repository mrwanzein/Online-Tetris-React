import React from 'react';
import styled from 'styled-components';

const OnlineUsers = ({ usersOnline }) => {
    return(
        <Wrapper>
            <UsersHeader>Online users:</UsersHeader>
            {
                !usersOnline ? <Spinner className="fa fa-spinner fa-spin"></Spinner> :
                usersOnline.length > 0 ? usersOnline.map(user => {
                    return(
                        <UserWrapper key={user}>
                            <User>{user}</User>
                        </UserWrapper>
                    )
                }) : 
                
                <NoUserMsg>
                    No users online :(
                </NoUserMsg>
            }
        </Wrapper>
    )
}

export default OnlineUsers;

const Wrapper = styled.div`
    position: relative;
    height: 300px;
    width: 500px;
    background-color: rgb(248, 248, 248);
    overflow: auto;
    margin-left: 120px;
    margin-top: 40px;
    margin-bottom: 30px;
    border-radius: 10px;
`;

const UserWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const UsersHeader = styled.div`
    font-size: 1.1em;
    font-style: bold;
    font-family: 'Press Start 2P', cursive;
    margin: 15px 0 15px 20px;
`;

const User = styled.div`
    margin: 10px 20px;
    padding: 10px 0 10px 30px;
    box-shadow: 0px 0px 11px -5px rgba(0,0,0,0.75);
`;

const NoUserMsg = styled.span`
    font-size: 1.5em;
    font-style: bold;
    font-family: 'Press Start 2P', cursive;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const Spinner = styled.i`
    position: absolute;
    top: 45%;
    left: 45%;
    transform: translate(-45%, -45%);
    font-size: 4em;
`;