import React from 'react';
import { Component } from 'react';
import Datetime from 'react-datetime'
import moment from 'moment'
import "react-datetime/css/react-datetime.css"
import axios from "axios";

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

const today = Datetime.moment();
const earliest_day = Datetime.moment("2010-01-01", "YYYY-MM-DD");  // The earliest day from which we have data

class TimeRangeSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMonthPicker : false,
            showYearPicker : true,
            currentDate : props.currentDate,
        };
        this.isValidDate = this.isValidDate.bind(this);

        // Keep track of the user input for each selection
        this.last_selected_year = props.currentDate.start_year;
        this.last_selected_month_and_year = { 
            start_year: props.currentDate.start_year, 
            start_month: props.currentDate.start_month,
            end_year: props.currentDate.end_year,
            end_month: props.currentDate.end_month,
        };
    }

    componentDidMount() {
        // axios
        //     .get("" + root_path + "/api/date_range")
        //     .then(res => this.setState( { min : new Date(res.data.min), max : new Date(res.data.max) } ))
        //     .catch(err => {
        //         console.log(err);

        //     });
    };

    componentDidUpdate(prevProps) {
        if (this.state.currentDate !== this.props.currentDate) {
            this.setState({ currentDate:  this.props.currentDate });
        }
    }

    isValidDate(current) {
        return (current.isBefore(today) && current.isAfter(earliest_day));       

    }

    formatMonthString(month) {

        // Check to see if you need to pad the month with leading zeroes
        // var month = this.last_selected_month_and_year.month + "";
        while (month.length < 2) {
            month = "0" + month;
        }
        return month;
    }

    getCurrentDateString() {
        if (this.state.currentDate.start_month !== null)
        {
            return months[this.state.currentDate.start_month - 1] + "-" + this.state.currentDate.start_year + " to " + months[this.state.currentDate.end_month - 1] + "-" + this.state.currentDate.end_year;
        }
        else
        {
            return "" + this.state.currentDate.start_year;
        }
        
    }

    handleStartMonthSelection(moment){
        const month = moment.format('MM');
        const year = moment.format('YYYY');
        this.props.handleTimeRangeSelection(month, year, this.last_selected_month_and_year.end_month, this.last_selected_month_and_year.end_year);
        this.last_selected_month_and_year.start_month = month;
        this.last_selected_month_and_year.start_year = year;
    }

    handleEndMonthSelection(moment) {
        const month = moment.format('MM');
        const year = moment.format('YYYY');
        this.props.handleTimeRangeSelection(this.last_selected_month_and_year.start_month, this.last_selected_month_and_year.start_year, month, year);
        this.last_selected_month_and_year.end_month = month;
        this.last_selected_month_and_year.end_year = year;
    }

    handleYearSelection(moment){
        const year = moment.format('YYYY');
        this.props.handleTimeRangeSelection(null, year, null, year);
        this.last_selected_year = year;
    }

    handleMonthPickerChange() {
        const newSetting = !this.state.showMonthPicker;

        // If the user checked month picker, then set the time range selection to their last selected input
        if (newSetting) {

            // If this.last_selected_month_and_year.month is null, then set it to 1 (january) as default
            if (this.last_selected_month_and_year.start_month === null) {
                this.last_selected_month_and_year.start_month = 1;
            }

            if (this.last_selected_month_and_year.end_month === null) {
                this.last_selected_month_and_year.end_month = 1;
            }

            this.props.handleTimeRangeSelection(this.last_selected_month_and_year.start_month, this.last_selected_month_and_year.start_year, this.last_selected_month_and_year.end_month, this.last_selected_month_and_year.end_year);
        }

        this.setState({ showMonthPicker : newSetting });
        this.setState({ showYearPicker: !newSetting });
    }

    handleYearPickerChange() {
        const newSetting = !this.state.showYearPicker;

        if (newSetting) {
            this.props.handleTimeRangeSelection(null, this.last_selected_year, null, this.last_selected_year);
        }

        this.setState({ showYearPicker: newSetting });
        this.setState({ showMonthPicker: !newSetting });
    }


    render() {
        const current_date_display = this.getCurrentDateString();
        return (
            <div className="col-12">
                <div className="card">
                    <h5 className="card-header">Date Range</h5>
                    <div className="card-body">
                        <div className="card-text">
                            <div className="row">
                                <label>
                                    <input type="radio" className="m-1" name="datePicker" checked={this.state.showMonthPicker}  onChange={() => this.handleMonthPickerChange()} />
                                    Monthly
                                </label>
                            </div>
                            <div className="row">
                                <label>
                                    <input type="radio" className="m-1" name="datePicker" checked={this.state.showYearPicker} onChange={() => this.handleYearPickerChange()} />
                                    Yearly
                                </label>
                            </div>
                            {this.state.showMonthPicker &&
                                <div>
                                    <div className="row">
                                    Start Month: <Datetime inputProps={{ readOnly: true }} isValidDate={this.isValidDate} dateFormat="MM-YYYY" defaultValue={moment(this.formatMonthString(this.last_selected_month_and_year.start_month) + "-" + this.last_selected_month_and_year.start_year, "MM-YYYY" )} timeFormat={false} onChange={(e) => this.handleStartMonthSelection(e)} />
                                    </div>
                        
                                    <div className="row">
                                    End Month: <Datetime inputProps={{ readOnly: true }} isValidDate={this.isValidDate} dateFormat="MM-YYYY" defaultValue={moment(this.formatMonthString(this.last_selected_month_and_year.end_month) + "-" + this.last_selected_month_and_year.end_year, "MM-YYYY")} timeFormat={false} onChange={(e) => this.handleEndMonthSelection(e)} />
                                    </div>
                                </div>
                            }
                            { this.state.showYearPicker && 
                            <div className="row">
                                <Datetime inputProps={{ readOnly: true }} isValidDate={this.isValidDate} dateFormat="YYYY" defaultValue={ moment("" + this.last_selected_year, "YYYY") } timeFormat={false} onChange={(e) => this.handleYearSelection(e)}/>
                            </div>}

                        </div>

                    </div>
                </div>
            </div>

        );
    }


}

export default TimeRangeSelection;