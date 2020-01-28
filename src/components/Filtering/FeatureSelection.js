import React from 'react';
import { Component } from 'react';

class FeatureSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            features: [],
        };
        // console.log("Feature selection data");
        // console.log(props.data);
    }
    componentDidMount() {
        this.getAllUniqueFeatures();
    };

    getAllUniqueFeatures() {
        // Extract all the different features from the data
        // All data should have the same features, so all the different feature labels can be found
        // from the first element of this.props.data
        console.log("Get all unique features");
        console.log(this.props.data.length);
        if (this.props.data.length > 0) {
            var features = this.props.data[0].features;
            var feature_labels = []
            for (var i = 0; i < features.length; ++i) {
                feature_labels.push(features[i].name);
            }

            this.setState({ features: feature_labels })
        }
    }

    handleChange(feature, event)
    {
        var val = event.target.value;
        this.props.handleSelection(val);
    }

    createFeatureRadioButtons() {
        var feature_buttons = [];
        for (var i = 0; i < this.state.features.length; ++i) {
            const feature = this.state.features[i];
            feature_buttons.push(
                <div className="radio">
                    <label>
                        <input type="radio" name="features" value={feature} onChange={(e) => this.handleChange(feature, e)} />
                        {feature}
                    </label>
                </div>
            );
        }

        return feature_buttons;
    }

    render() {
        return (
            <div className="col-12">
                <div className="card">
                    <h5 className="card-header">Features</h5>
                    <div className="card-body">
                        <div className="card-text">
                            {this.createFeatureRadioButtons()}
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default FeatureSelection;