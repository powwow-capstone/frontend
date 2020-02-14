import React from 'react';
import { Component } from 'react';
import Datetime from 'react-datetime'
import moment from 'moment'
import "react-datetime/css/react-datetime.css"

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

class TimeRangeSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMonthPicker : false,
            showYearPicker : true,
            currentDate : props.currentDate
        };

        // Keep track of the user input for each selection
        this.last_selected_year = props.currentDate.year;
        this.last_selected_month_and_year = { year: props.currentDate.year, month: props.currentDate.month };
    }

    componentDidUpdate(prevProps) {
        if (this.state.currentDate !== this.props.currentDate) {
            this.setState({ currentDate:  this.props.currentDate });
        }
    }

    formatYearString() {

        // Ensure that the year selected is 4 digits long
        // This is a sanity check. You should never need to pad the year
        var year = this.state.currentDate.year + "";
        while (year.length < 4) {
            year = "0" + year;
        }

        return year;
    }

    formatMonthString() {

        // Check to see if you need to pad the month with leading zeroes
        var month = this.last_selected_month_and_year.month + "";
        while (month.length < 2) {
            month = "0" + month;
        }
        return month;
    }

    getCurrentDateString() {
        if (this.state.currentDate.month !== null)
        {
            return months[this.state.currentDate.month - 1] + "-" + this.state.currentDate.year;
        }
        else
        {
            return "" + this.state.currentDate.year;
        }
        
    }

    handleMonthSelection(moment){
        const month = moment.format('MM');
        const year = moment.format('YYYY');
        this.props.handleTimeRangeSelection(month, year);
        this.last_selected_month_and_year.month = month;
        this.last_selected_month_and_year.year = year;
    }

    handleYearSelection(moment){
        const year = moment.format('YYYY');
        this.props.handleTimeRangeSelection(null, year);
        this.last_selected_year = year;
    }

    handleMonthPickerChange() {
        const newSetting = !this.state.showMonthPicker;

        // If the user checked month picker, then set the time range selection to their last selected input
        if (newSetting) {

            // If this.last_selected_month_and_year.month is null, then set it to 1 (january) as default
            if (this.last_selected_month_and_year.month === null) {
                this.last_selected_month_and_year.month = 1;
            }

            this.props.handleTimeRangeSelection(this.last_selected_month_and_year.month, this.last_selected_month_and_year.year);
        }

        this.setState({ showMonthPicker : newSetting });
        this.setState({ showYearPicker: !newSetting });
    }

    handleYearPickerChange() {
        const newSetting = !this.state.showYearPicker;

        if (newSetting) {
            this.props.handleTimeRangeSelection(null, this.last_selected_year);
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
                            <div className="row mb-2">
                                Currently Displaying: {current_date_display}
                            </div>
                            <div className="row">
                                <label>
                                    <input type="radio" className="m-1" name="datePicker" checked={this.state.showMonthPicker}  onChange={() => this.handleMonthPickerChange()} />
                                    Monthly Average
                                </label>
                            </div>
                            <div className="row">
                                <label>
                                    <input type="radio" className="m-1" name="datePicker" checked={this.state.showYearPicker} onChange={() => this.handleYearPickerChange()} />
                                    Yearly Average
                                </label>
                            </div>
                            {this.state.showMonthPicker &&
                                <div className="row">
                                <Datetime inputProps={{ readOnly: true }} dateFormat="MM-YYYY" defaultValue={moment( this.formatMonthString() + "-" + this.last_selected_month_and_year.year, "MM-YYYY" )} timeFormat={false} onChange={(e) => this.handleMonthSelection(e)} />
                                </div>}
                            { this.state.showYearPicker && 
                            <div className="row">
                                <Datetime inputProps={{ readOnly: true }} dateFormat="YYYY" defaultValue={ moment("" + this.last_selected_year, "YYYY") } timeFormat={false} onChange={(e) => this.handleYearSelection(e)}/>
                            </div>}

                        </div>

                    </div>
                </div>
            </div>

        );
    }

}

export default TimeRangeSelection;