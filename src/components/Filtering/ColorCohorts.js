import React from 'react';
import { Component } from 'react';
import "../../css/index.css";

class ColorCohort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorCohorts : props.colorCohorts,
        };
    }

    componentDidUpdate(prevProps) {
        // Force a rerender when the data changes or when the user switches the coloring option
        if (this.state.colorCohorts !== this.props.colorCohorts) {
            this.setState({ colorCohorts: this.props.colorCohorts })
        }
    }

    handleClick() {
        this.props.handleClick();
    }

    setButtonText() {
        if (this.state.colorCohorts) {
            return "Color Outliers"
        }
        else {
            return "Color Cohorts"
        }
    }

    render() {
        return (
            <button type="button" className="btn btn-primary" onClick={() => this.handleClick()}>{this.setButtonText()}</button>
        );
    }
}

export default ColorCohort;