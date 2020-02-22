import React, { Component } from 'react';
import axios from "axios";
import SlidingPane from 'react-sliding-pane';
import Graph from '../Graph/Graph';
import Loader from '../Loader/Loader';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import ReactModal from 'react-modal';
import ModalContent from './ModalContent'
import "../../css/Sidebar.css"

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
            datapoints : null,
            loading: true,
			showModal: false
        };
        this.source = null;
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    
    componentDidUpdate(prevProps) {
        if ( prevProps.isPaneOpen !== this.props.isPaneOpen ) {
            this.refreshList(this.props.clicked_cohort_ids );
            this.setState({ isPaneOpen: this.props.isPaneOpen, loading: true });
        }
    }

    formatCategoryOutput(name, value) {
        // Output the Category information in a special format depending on the field
        // Or output the default if no special format exists
        switch (name) {
            case "Acreage":
                return <h6><li key={name}>{"Area: " + value.toFixed(1) + " acres"}</li></h6>
                break
            
            default:
                return <h6><li key={name}>{name + ": " + value}</li> </h6>
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
    
    refreshList(cohortIDs) {
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();

        var api_endpoint = "" + root_path + "/api/eta?objectid=" + this.props.clicked_id;
        api_endpoint += "&start_month=" + this.props.dateRange.start_month + "&start_year=" + this.props.dateRange.start_year + "&end_month=" + this.props.dateRange.end_month + "&end_year=" + this.props.dateRange.end_year;

		axios
            .put(api_endpoint, cohortIDs, {
                cancelToken: this.source.token
            })
            .then(res => { 
                console.log(res.data);
                this.setState({ datapoints: res.data, loading: false});
            })
            .catch(err => console.log(err));
    };

    handleOpenModal () {
        this.setState({ showModal: true });
    }
    
    handleCloseModal () {
        this.setState({ showModal: false });
    }

    slidingTitle() {
        return <div className="slideTitle">	 
                    {"Field Details: " + this.parseDateRangeIntoString(this.props.dateRange)}
                    <IconButton className = "infoButton" aria-label="delete" onClick={() => this.handleOpenModal()}>
                        <InfoIcon color="primary" />
                    </IconButton>
        
                    <ReactModal className="modal-con" isOpen={this.state.showModal}  contentLabel="Minimal Modal Example" >  
                        <button type="button" className="close" aria-label="Close" onClick={this.handleCloseModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <ModalContent/>
                    </ReactModal>
                </div>
    }
    
    render() {

        var listCategories = null;
        if (this.props.categories){
            listCategories = this.props.categories.map((category) => this.formatCategoryOutput(category.category_name, category.value));
        }
        var listFeatures = null;
        if (this.props.features){
            listFeatures= this.props.features.map((feature) => 
                <h6><li key={feature.name}>{feature.name + ": " + feature.value.toFixed(2) + " " + feature.units}</li> </h6>
            );
        }
        return (
            <div>
                <SlidingPane
                    className='some-custom-class'
                    overlayClassName='some-custom-overlay-class'
                    isOpen={this.state.isPaneOpen}
                    title={this.slidingTitle()}
                    from='left'
                    onRequestClose={() => {
                        // triggered on "<" on left top click or on outside click
                        this.source.cancel('Operation canceled by the closing sidebar.');
                        this.props.onClose(false);

                    }}>
                    <div>  
                        {listCategories && listFeatures && <ul>
                            {listCategories}
                            {listFeatures}
                        </ul>}               
                        { 
                            this.state.datapoints !== null 
                            && this.state.datapoints.field_stats !== null // && this.state.datapoints.cohort_stats !== null
                            && this.state.datapoints.field_stats instanceof Array // && this.state.datapoints.cohort_stats instanceof Array
                            && this.state.datapoints.field_stats.length > 0 
                            && this.state.loading===false
                            && <Graph datapoints={this.state.datapoints.field_stats} cohort_datapoints={this.state.datapoints.cohort_stats} dateRange={this.props.dateRange} />
                        }
                        <Loader loading={this.state.loading}/>
                    </div>
                </SlidingPane>
            </div>
        );
    }
}

export default Sidebar;
