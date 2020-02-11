import React from 'react';
import { Component } from 'react';
import Datetime from 'react-datetime'
import moment from 'moment'
import "react-datetime/css/react-datetime.css"

class TimeRangeSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMonthPicker : false,
            showYearPicker : true
        };
        this.currentDate = props.currentDate;
    }

    componentDidUpdate(prevProps) {
        if (this.currentDate !== this.props.currentDate) {
            this.currentDate = this.props.currentDate;
        }
    }

    formatYearString() {
        // Convert this.currentDate to a moment object that can be read by Datetime

        // Ensure that the year selected is 4 digits long
        // This is a sanity check. You should never need to pad the year
        var year = this.currentDate.year + "";
        while (year.length < 4) {
            year = "0" + year;
        }

        return year;
    }

    formatMonthString() {
        // Convert this.currentDate to a moment object that can be read by Datetime
        
        // Check to see if you need to pad the month with leading zeroes
        var month = this.currentDate.month + "";
        while (month.length < 2) {
            month = "0" + month;
        }
        return month;
    }

    getCurrentDateString() {
        if (this.currentDate.month !== null)
        {
            return this.formatMonthString() + "-" + this.formatYearString();
        }
        else
        {
            return this.formatYearString();
        }
        
    }

    handleMonthSelection(moment){
        const month = moment.format('MM');
        const year = moment.format('YYYY');
        this.props.handleTimeRangeSelection(month, year);
        this.currentDate.month = month;
        this.currentDate.year = year;
    }

    handleYearSelection(moment){
        const year = moment.format('YYYY');
        this.props.handleTimeRangeSelection(null, year);
        this.currentDate.year = year;
    }

    handleMonthPickerChange() {
        const newSetting = !this.state.showMonthPicker;

        this.setState({ showMonthPicker : newSetting });
        this.setState({ showYearPicker: !newSetting });
    }

    handleYearPickerChange() {
        const newSetting = !this.state.showYearPicker;

        this.setState({ showYearPicker: newSetting });
        this.setState({ showMonthPicker: !newSetting });
    }


    render() {
        return (
            <div className="col-12">
                <div className="card">
                    <h5 className="card-header">Time Range</h5>
                    <div className="card-body">
                        <div className="card-text">
                            <div className="row mb-2">
                                Currently Displaying: {this.getCurrentDateString()}
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
                                <Datetime dateFormat="MM-YYYY" defaultValue={moment( this.formatMonthString() + "-" + this.formatYearString(), "MM-YYYY" )} timeFormat={false} onChange={(e) => this.handleMonthSelection(e)} />
                                </div>}
                            { this.state.showYearPicker && 
                            <div className="row">
                                <Datetime dateFormat="YYYY" defaultValue={ moment(this.formatYearString(), "YYYY") } timeFormat={false} onChange={(e) => this.handleYearSelection(e)}/>
                            </div>}

                        </div>

                    </div>
                </div>
            </div>

        );
    }


}

export default TimeRangeSelection;