import React from 'react';
import { Component } from 'react';

class FeatureSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {

            data: props.data,           
            features: [],
        };
    }
    componentDidMount() {
        this.getAllUniqueFeatures();
    };

    getAllUniqueFeatures() {
        // Extract all the different features from the data
        // All data should have the same features, so all the different feature labels can be found
        // from the first element of this.state.data
        if (this.state.data.length > 0) {
            var features = this.state.data[0].features;
            var feature_labels = []
            for (var i = 0; i < features.length; ++i) {
                feature_labels.push(features[i].name);
            }
            
            this.setState({ features: feature_labels })
        }
    }

    createFeatureRadioButtons() {
        var feature_buttons = [];
        for (var i = 0; i < this.state.features.length; ++i) {
            feature_buttons.push(
                <div className="radio">
                    <label>
                        <input type="radio" name="features" value={this.state.features[i]} />
                        {this.state.features[i]}
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