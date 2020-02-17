import React from 'react';
import '../../css/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../Home';
import MainLoading from '../../MainLoading';
 
const App = () => (     
      <BrowserRouter>
      <div>
        <MainLoading/>
        <Switch>
          <Route path="/" component={Home} exact/>
        </Switch>
      </div> 
    </BrowserRouter>
);

export default App;