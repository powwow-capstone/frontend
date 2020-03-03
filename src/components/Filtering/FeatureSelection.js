import React from 'react';
import { Component } from 'react';
import InfoButton from "../Info/InfoButton";
import ReactModal from 'react-modal';
import "../../css/FeatureSelection.css";

class FeatureSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            features: [],
            showModal: false
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentDidMount() {
        this.getAllUniqueFeatures();
    };

    getAllUniqueFeatures() {
        // Extract all the different features from the data
        // All data should have the same features, so all the different feature labels can be found
        // from the first element of this.props.data
        if (this.props.data.length > 0) {
            const features = this.props.data[0].features;
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
            if (i === 0){
                feature_buttons.push(
                    <div className="radio">
                        <label>
                            <input type="radio" className="m-1" name="features"  value={feature} defaultChecked onChange={(e) => this.handleChange(feature, e)} />
                            {feature}
                        </label>
                    </div>
                );
                this.props.handleSelection(feature, true);
            }
            else{
                feature_buttons.push(
                    <div className="radio">
                        <label>
                            <input type="radio" className="m-1" name="features"  value={feature} onChange={(e) => this.handleChange(feature, e)} />
                            {feature}
                        </label>
                    </div>
            
                );
            }
        }

        return feature_buttons;
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render() {
        
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h5 className="d-inline-block">Data Type</h5>
                        <InfoButton handleOpenModal={this.handleOpenModal}/>
                    </div>
        
                    <ReactModal className="modal-side-features" isOpen={this.state.showModal}  contentLabel="Minimal Modal Example"  style={{ overlay: { backgroundColor: 'transparent' }}}>  
                        <div class="modal-header">
                            <h5 class="modal-title">Data Type</h5>
                            <button type="button" className="close" aria-label="Close" onClick={this.handleCloseModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>Select which data to process and display on the map. 
                                The coloring and graphs will reflect this choice.
                                <br/>
                                ETa - Evapotranspiration - The amount of water evaporated from the leaves of plant into the atmosphere.
                                
                            </p>
                        </div>
                    </ReactModal>
                    <div className="card-body">
                        
                        {this.createFeatureRadioButtons()}
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default FeatureSelection;