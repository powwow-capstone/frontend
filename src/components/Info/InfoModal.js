import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'reactstrap';
import infoIcon from '../../images/infoIcon.svg';
import '../../css/App.css';

class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show : false
        };
    }

    
    render() {
        return (
            <div>
                <Button color="link" id="info" onClick={() => this.setState({ show: true })}>
                    <img src={infoIcon} />
                </Button>
        
                <Modal show={this.state.show} onHide={() => this.setState({ show: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>ETa or Actual evapotranspiration is the quantity of water that is actually removed from a surface due to the processes of evaporation and transpiration.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ show: false })}>
                        Close
                    </Button>
                </Modal.Footer>
                </Modal>
            </div>
        );
    }
        
}

  
export default InfoModal;