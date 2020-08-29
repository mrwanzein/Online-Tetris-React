import React from 'react';

import Tetris from '../Tetris';
import OnlineUsers from '../OnlineUsers';
import { GameContext } from '../GameContext';

const Homepage = () => {
    const {socket} = React.useContext(GameContext);
    const [onlineUsers, setOnlineUsers] = React.useState(null);
    
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
    }, [socket]);

    return(
        <>
            <OnlineUsers usersOnline={onlineUsers} />
            <Tetris />
        </>
    )
}

export default Homepage;