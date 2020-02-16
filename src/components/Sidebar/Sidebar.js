import React, { Component } from 'react';
import axios from "axios";
import SlidingPane from 'react-sliding-pane';
import Graph from '../Graph/Graph';
import 'react-sliding-pane/dist/react-sliding-pane.css';

const root_path = process.env.REACT_APP_ROOT_PATH;
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];


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

    parseDateRangeIntoString(date_range) {
        const start_month = date_range.start_month;
        const start_year = date_range.start_year;
        const end_month = date_range.end_month;
        const end_year = date_range.end_year;

        var str = "";
        if (start_month !== null) {
            str += months[start_month - 1] + "-"
        }
        str += start_year;
        if (end_month !== null) {
            str += " to " + months[end_month - 1] + "-" + end_year;
        }
        else
        {
            if (start_year !== end_year)
            {
                str += " to " + end_year;
            }
        }

        return str;
    }
    
    refreshList() {
		axios
            .get("" + root_path + "/api/eta?objectid="+this.props.clicked_id)
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
                    title={"Field Details: " + this.parseDateRangeIntoString(this.props.dateRange)} 
                    // subtitle='Optional subtitle.'
                    from='left'
                    onRequestClose={() => {
                        // triggered on "<" on left top click or on outside click
                        this.props.onClose(false);
                    }}>
                    <div> 
                        {listCategories && listFeatures && <ul>
                            {listCategories}
                            {listFeatures}
                        </ul>}               
                        {this.state.datapoints.length>0 && <Graph datapoints={this.state.datapoints}/>}
                    </div>
                </SlidingPane>
            </div>
        );
    }
}

export default Sidebar;
