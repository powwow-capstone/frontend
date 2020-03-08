import React from 'react';
import { Component } from 'react';
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "../../css/bootstrap.min.css";
import * as legoData from "../../astronaut-loading.json";
import * as doneData from "../../doneloading.json";
import { Dot } from 'react-animated-dots';

const root_path = process.env.REACT_APP_ROOT_PATH;

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


class MainLoading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        done: props.done
        };
    }

    componentDidUpdate(prevProps) {
        // Force a rerender when the data changes or when the user switches the coloring option
        if (this.state.done !== this.props.done) {
            this.setState({ done: this.props.done })
        }
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

export default MainLoading;