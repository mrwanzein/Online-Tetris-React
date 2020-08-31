import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import GlobalStyle from './utils/GlobalStyles';
import { GameContextWithoutSocketTriggerProvider } from './Components/GameContextWithoutSocketTriggerProvider';

import Navbar from './Components/Navbar';
import Homepage from './Components/Home';
import Register from './Components/Register';
import Log_in from './Components/Log_in';
import Battle_Area from './Components/Battle_Area';

function App() {
  return (
    <>
      <GlobalStyle />
      <GameContextWithoutSocketTriggerProvider>
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Log_in} />
            <Route exact path="/battle" component={Battle_Area} />
          </Switch>
        </BrowserRouter>
      </GameContextWithoutSocketTriggerProvider>
    </>
  );
}

export default App;
