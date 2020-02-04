import React, { Component } from 'react';
import axios from "axios";
import SlidingPane from 'react-sliding-pane';
import Graph from '../Graph/Graph';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPaneOpen: props.isPaneOpen,
            datapoints: []
        };
    }
    
    componentDidUpdate(prevProps) {
        if ( prevProps.isPaneOpen !== this.props.isPaneOpen ) {
            this.refreshList();
            this.setState({ isPaneOpen: this.props.isPaneOpen })
        }
    }
    
    refreshList() {
		axios
			.get( "https://space-monitor-backend.herokuapp.com/api/eta?objectid="+this.props.clicked_id)
			.then(res => this.setState({ datapoints: res.data }))
            .catch(err => console.log("ERR" + err));
    };

    
    render() {

        return (
            <div>
                <SlidingPane
                    className='some-custom-class'
                    overlayClassName='some-custom-overlay-class'
                    isOpen={this.state.isPaneOpen}
                    title='Hey, it is optional pane title.  I can be React component too.'
                    subtitle='Optional subtitle.'
                    from='left'
                    onRequestClose={() => {
                        // triggered on "<" on left top click or on outside click
                        this.props.onClose(false);
                    }}>
                    <div> <Graph datapoints={this.state.datapoints}/> </div>
                </SlidingPane>
            </div>
        );
    }
}

export default Sidebar;
