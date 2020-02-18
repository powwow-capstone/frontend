import React from 'react';
import { Component } from 'react';

class ColorCohort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorCohort : props.colorCohorts,
        };
    }

    componentDidUpdate(prevProps) {
        console.log("Update color cohort");
        // Force a rerender when the data changes or when the user switches the coloring option
        if (this.state.colorCohorts !== this.props.colorCohorts) {
            this.setState({ colorCohorts: this.props.colorCohorts })
        }
    }

    handleClick() {
        this.props.handleClick();
    }

    setButtonText() {
        if (this.state.colorCohort) {
            return "Color Outliers"
        }
        else {
            return "Color Cohorts"
        }
    }

    render() {
        return (
            <div>
                <button type="button" class="btn btn-primary" onClick={() => this.handleClick()}>{this.setButtonText()}</button>
            </div>
        );
    }
}

export default ColorCohort;