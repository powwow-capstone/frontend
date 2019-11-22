import React from 'react';

import { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
 
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup'; 
import Navigation from './components/Navigation';

class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
          <Navigation />
            <Switch>
             <Route path="/" component={Home} exact/>
             <Route path="/login" component={Login}/>
             <Route path="/signup" component={Signup}/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 

export default App;