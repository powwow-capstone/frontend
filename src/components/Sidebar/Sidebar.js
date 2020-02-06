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
            .catch(err => console.log(err));
    };

    
    render() {
        var listCategories = null;
        if (this.props.categories){
            listCategories = this.props.categories.map((category) =>
                <li key={category.category_name}>{category.category_name + ": " + category.value}</li> 
            );
        }
        var listFeatures = null;
        if (this.props.features){
            listFeatures= this.props.features.map((feature) =>
                <li key={feature.name}>{feature.name + ": " + feature.value}</li> 
            );
        }
        return (
            <div>
                <SlidingPane
                    className='some-custom-class'
                    overlayClassName='some-custom-overlay-class'
                    isOpen={this.state.isPaneOpen}
                    title='Field Bio'
                    // subtitle='Optional subtitle.'
                    from='left'
                    onRequestClose={() => {
                        // triggered on "<" on left top click or on outside click
                        this.props.onClose(false);
                    }}>
                    <div> 
                        <ul>
                            {listCategories}
                            {listFeatures}
                        </ul>               
                        <Graph datapoints={this.state.datapoints}/> 
                    </div>
                </SlidingPane>
            </div>
        );
    }
}

export default Sidebar;
