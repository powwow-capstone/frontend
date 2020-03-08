import React from 'react';
import { Component } from 'react';
import "../../css/index.css";
import InfoButton from "../Info/InfoButton";
import ReactModal from 'react-modal';

class ColorCohort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorCohorts : props.colorCohorts,
            showModal: false
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
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
            return "Color Clusters"
        }
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div>
                <div className="coloring-btn">
                    <button type="button" className="btn btn-primary d-inline-block" onClick={() => this.handleClick()}>{this.setButtonText()}</button>
                    <InfoButton handleOpenModal={this.handleOpenModal}/>
                </div>
                <ReactModal className="modal-side-cohorts" isOpen={this.state.showModal}  contentLabel="Minimal Modal Example" style={{ overlay: { backgroundColor: 'transparent' }}}>
                    <div class="modal-header">
                        <h5 class="modal-title">Color Cluster/Color Outliers</h5>
                        <button type="button" className="close" aria-label="Close" onClick={this.handleCloseModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
						<p>
						<b>Outlier mode</b> colors all fields green or red based on its individual data values compared to every field in the cohort.
                        <br/><br/><b>Cluster mode</b> colors all fields within the same cluster as the same color. Visually see which fields are being compared together.
                        </p>
                    </div>
                </ReactModal>
            </div>
        );
    }
}

export default ColorCohort;