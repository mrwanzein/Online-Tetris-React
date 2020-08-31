import React from 'react';

export const GameContextWithoutSocketTrigger = React.createContext(null);

export const GameContextWithoutSocketTriggerProvider = ({ children }) => {
    const [localUser, setLocalUser] = React.useState(null); 
    
    return <GameContextWithoutSocketTrigger.Provider value={{
        localUser, 
        setLocalUser
    }}>{children}
    </GameContextWithoutSocketTrigger.Provider>;
}