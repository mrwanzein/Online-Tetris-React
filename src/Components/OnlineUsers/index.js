import React from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";

import { GameContext } from '../GameContext';
import { GameContextWithoutSocketTrigger } from '../GameContextWithoutSocketTriggerProvider';

const OnlineUsers = ({ usersOnline }) => {
    const {socket} = React.useContext(GameContext);
    const { localUser } = React.useContext(GameContextWithoutSocketTrigger)
    const [challengers, setChallengers] = React.useState([]);
    const [challenged, setChallenged] = React.useState(false);

    let history = useHistory();

    React.useEffect(() => {
        socket.on('whoChallengeMe', (challenger) => {
            setChallengers(prev => [...prev, challenger]);
        });

        socket.on('challengeRefused', (res) => {
            setChallenged(res);
        });

        socket.on('getInRoom', (roomToJoin) => {
            socket.emit('challengerTurnToJoinRoom', roomToJoin);
            history.push('/battle');
        });

        return () => {
            socket.off("whoChallengeMe");
            socket.off("challengeRefused");
            socket.off("getInRoom");
        }
    }, [socket, history]);

    return(
       <>
        {
            !localUser ? 
            
            <HeaderWrapper style={{color: "white", fontFamily: "'Press Start 2P', cursive", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"}}>
                <div style={{paddingTop: "60px", lineHeight: '1.2'}}>
                    <div style={{fontSize: '3em', padding: '20px 20px'}}>Welcome to Ultimate Tetris Mania!</div>
                    <div style={{fontSize: '1.5em', margin: '40px 20px'}}>If you wanna play against other people, please register. It's simple and fast!</div>
                    <div style={{fontSize: '1.5em', margin: '70px 20px'}}>Or, you can just practice good ol Tetris below</div>
                </div>
            </HeaderWrapper>
            
            :
            
            ( <Wrapper>
                <UsersSpace>
                    <UsersHeader>Online users:</UsersHeader>
                    {
                        !usersOnline ? <Spinner className="fa fa-spinner fa-spin"></Spinner> :
                        usersOnline.length > 0 ? usersOnline.map(user => {
                            return(
                                <UserWrapper key={user[0]}>
                                    <User id={user[0]}>{user[0]}</User>
                                    { 
                                        localUser === user[0] ? <span style={{margin: "0 10px"}}>(you)</span> :
                                        !challenged ? <StyledChallengeButton onClick={() => {
                                            const opponent = document.getElementById(user[0]).textContent;
                                            setChallenged(true);
                                            socket.emit('challengeOpponent', opponent);
                                        }}>
                                            Challenge
                                        </StyledChallengeButton> :
                                        <StyledChallengeButton disabled style={{opacity: '0.7'}}>
                                            Challenged
                                        </StyledChallengeButton>
                                    }
                                </UserWrapper>
                            )
                        }) : 
                        
                        <NoUserMsg>
                            No users online :(
                        </NoUserMsg>
                    }
    
                </UsersSpace>
                
                <ChallengeNotice>
                    {challengers.length ? <ChallengeNoticeHeader>Here they come</ChallengeNoticeHeader> : <ChallengeNoticeHeader>Awaiting challengers...</ChallengeNoticeHeader>}
                    {
                        challengers.length ? 
                        challengers.map(challenger => {
                            return(
                                <ChallengersList key={`Challenger: ${challenger}`}>
                                    <div>
                                        <span style={{fontWeight: 'bold', marginLeft: '5px'}}>{`${challenger}`}</span> challenges you!
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <StyledChallengeButton style={{backgroundColor: 'rgb(40, 201, 83)'}} onClick={(e) => {
                                            e.target.innerHTML = "loading...";
                                            socket.emit('joinBattleRoom', [localUser, challenger]);
                                            history.push('/battle');
                                        }}>
                                            Accept
                                        </StyledChallengeButton>
                                        
                                        <StyledChallengeButton style={{backgroundColor: 'red'}} onClick={(e) => {
                                            socket.emit('challengeRefused', challenger);
                                            e.target.innerHTML = "loading...";
                                            setChallengers(prev => {
                                                let copy = prev;
                                                copy.splice(copy[copy.indexOf(challenger)], 1);
                                                return copy;
                                            })
                                        }}>
                                            Refuse
                                        </StyledChallengeButton>
                                    </div>
                                </ChallengersList>
                            )
                        }) : null
                    }
                </ChallengeNotice>
            </Wrapper>)
        }
       </>
    )
}

export default OnlineUsers;

const Wrapper = styled.div`
    display: flex;
    background-color: royalblue;
`;

const HeaderWrapper = styled.div`
    background-image: url("/assets/homePageBG.png");
    height: 500px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;

const UsersSpace = styled.div`
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
    justify-content: space-between;
    align-items: center;
    margin: 10px 20px;
    padding: 10px 0 10px 30px;
    box-shadow: 0px 0px 11px -5px rgba(0,0,0,0.75);
`;

const UsersHeader = styled.div`
    font-size: 1.1em;
    font-style: bold;
    font-family: 'Press Start 2P', cursive;
    margin: 15px 0 30px 20px;
`;

const User = styled.div`
    margin: 0 20px;
    font-weight: bold;
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

const ChallengeNotice = styled.div`
    height: 300px;
    width: 500px;
    background-color: rgb(248, 248, 248);
    margin-left: 120px;
    margin-top: 40px;
    margin-bottom: 30px;
    border-radius: 10px;
    overflow: auto;
`;

const ChallengeNoticeHeader = styled.div`
    font-size: 1.1em;
    font-style: bold;
    font-family: 'Press Start 2P', cursive;
    margin: 15px 0 30px 20px;
`;
const ChallengersList = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px;
    padding: 10px;
    background: lightsalmon;
`;

const Spinner = styled.i`
    position: absolute;
    top: 45%;
    left: 45%;
    transform: translate(-45%, -45%);
    font-size: 4em;
`;

const StyledChallengeButton= styled.button`
	margin: 10px;
    padding: 5px 15px;
	border-radius: 10px;
	font-size: 10px;
    font-family: 'Press Start 2P', cursive;
	color: #FFF;
	text-decoration: none;
    transition: all 0.1s;
    background-color: #3498DB;
	border-bottom: 5px solid #2980B9;
	text-shadow: 0px -2px #2980B9;
    cursor: pointer;

    &:active {
        transform: translate(0px,2px);
	    border-bottom: 1px solid;
    }

    &:focus {
        outline: none;
        border-color: blue;
        box-shadow: 0 0 5px 0 rgb(64, 64, 245);
    }
`;