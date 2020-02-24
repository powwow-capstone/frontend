import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import "../../css/InfoButton.css";

class InfoButton extends Component {
    constructor(props) {
        super(props);
        

    }
    render() {
        return (
            <IconButton className = "infoButton" aria-label="delete" onClick={this.props.handleOpenModal}>
                <InfoIcon color="primary" />
            </IconButton>
        );
    }
}

export default InfoButton;