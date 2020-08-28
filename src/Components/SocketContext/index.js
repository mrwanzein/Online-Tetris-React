import React from 'react';
import socketIo from 'socket.io-client';


export const SocketContext = React.createContext(null);

export const SocketProvider = ({ children }) => {
    const socket = socketIo("http://localhost:8000");
    
    return <SocketContext.Provider value={{
        socket
    }}>{children}
    </SocketContext.Provider>;
}