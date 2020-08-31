import React from 'react';

import Tetris from '../Tetris';
import OnlineUsers from '../OnlineUsers';
import { GameContext } from '../GameContext';

import { useInterval } from '../Tetris/hooks/useInterval';

const Homepage = () => {
    const [onlineUsers, setOnlineUsers] = React.useState(null);
    const {socket} = React.useContext(GameContext);
    
    
    React.useEffect(() => {
        
        socket.emit('getLoggedInUsers');
        
        socket.on("getLoggedInUsers", (users) => {
            setOnlineUsers(users);
        });
        
        socket.on("getNewLoggedInUsers", (users) => {
            setOnlineUsers(users);
        });
        
        return () => {
            socket.off("getLoggedInUsers");
            socket.off("getNewLoggedInUsers");
        }
        
    }, [socket, setOnlineUsers]);
    
    useInterval(() => {
        socket.emit('getLoggedInUsers');
            
        socket.on("getLoggedInUsers", (users) => {
            setOnlineUsers(users);
        });
    }, 3000);
    
    return(
        <>
            <OnlineUsers usersOnline={onlineUsers}/>
            <Tetris />
        </>
    )
}

export default Homepage;