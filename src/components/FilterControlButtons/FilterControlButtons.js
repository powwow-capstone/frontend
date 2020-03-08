import React from 'react';
import { Component } from 'react';
import LoadFiltersPopup from './LoadFiltersPopup';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

class FilterControlButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            authUser: props.authUser,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.state.authUser !== this.props.authUser) {
            this.setState({ authUser: this.props.authUser });
        }
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    render() {
        return ( 
            <div>
                <ButtonGroup className="apply-button-container" size="large" variant="contained" color="primary" aria-label="contained primary button group">
                    <Button def onClick={() => this.props.submitFilters()}>Apply</Button>
                    <Button disabled={!this.state.authUser} def onClick={(event) => this.props.saveFilters(event, this.state.authUser)}>Save</Button>
                    <Button disabled={!this.state.authUser} def onClick={this.togglePopup.bind(this)}>Load</Button>
                </ButtonGroup>
                {this.state.showPopup ?
                    <LoadFiltersPopup
                        authUser={this.state.authUser}
                        firebase={this.props.firebase}
                        loadFilters={this.props.loadFilters}
                        closePopup={this.togglePopup.bind(this)}
                    />
                    : null
                }
            </div>
        );
    }
}

export default FilterControlButtons;