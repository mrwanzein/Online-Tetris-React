import React from 'react';
import socketIo from 'socket.io-client';


export const GameContext = React.createContext(null);

export const GameProvider = ({ children }) => {
    const socket = socketIo("http://localhost:8000");
    
    return <GameContext.Provider value={{
        socket
    }}>{children}
    </GameContext.Provider>;
}