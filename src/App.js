import React from 'react';
import { Component } from 'react';
import './css/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import MainLoading from './MainLoading';
 
class App extends Component {
  render() {
    return (      
      <BrowserRouter>
      <div>
        <MainLoading/>
        <Switch>
          <Route path="/" component={Home} exact/>
        </Switch>
      </div> 
    </BrowserRouter>
    );
  }
}

export default App;