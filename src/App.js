import React from 'react';
import { Component } from 'react';
import './css/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "./css/bootstrap.min.css";
import * as legoData from "./astronaut-loading.json";
import * as doneData from "./doneloading.json";
import { Dot } from 'react-animated-dots';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: legoData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
const defaultOptions2 = {
  loop: false,
  autoplay: true,
  animationData: doneData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: undefined
    };
  }
// Bad practice? mayhaps
  componentDidMount() {
    setTimeout(() => {
      fetch("https://space-monitor-backend.herokuapp.com/api/fields?month=null&year=2014")
        .then(response => response.json())
        .then(json => {
          this.setState({ loading: true });
          setTimeout(() => {
            this.setState({ done: true });
          }, 1200);
        });
    }, 1200);
  }

  render() {
    return (
      <div>            
        {!this.state.done && (
          <div className="App">
            <header className="App-header">
              <FadeIn>
                <div class="d-flex justify-content-center align-items-center">
                  {!this.state.loading ? (
                    <Lottie options={defaultOptions} height={360} width={360} />
                  ) : (
                    <Lottie options={defaultOptions2} height={360} width={360} />
                  )}
                </div>
                <h1>Loading
                    <Dot>.</Dot>
                    <Dot>.</Dot>
                    <Dot>.</Dot>
                </h1>
              </FadeIn>
            </header>
          </div>
          )
        }
      </div>
    );
  }
}
 
class App extends Component {
  render() {
    return (      
      
      <BrowserRouter>
      <div>
        <Loading/>
        <Switch>
          <Route path="/" component={Home} exact/>
        </Switch>
      </div> 
    </BrowserRouter>
    );
  }
}

export default App;