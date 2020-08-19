import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import GlobalStyle from './utils/GlobalStyles';

import Navbar from './Components/Navbar';
import Homepage from './Components/Home';
import Register from './Components/Register';
import Log_in from './Components/Log_in';

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Log_in} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
