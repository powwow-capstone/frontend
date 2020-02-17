import React, { Component } from 'react';
import CanvasJSReact from '../../canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Graph extends Component {
 
    constructor(props) {
		super(props);
		this.state = {
			datapoints: []
		};
    }
	
	static getDerivedStateFromProps(nextProps, prevState) {
        return {
            datapoints: nextProps.datapoints,
        };
	}

	extract_data(raw_data) {
		var processed_datapoints = []; 
		for (var i = 0; i < raw_data.length; i++) {
			processed_datapoints.push({
				x: new Date(raw_data[i].date),
				y: raw_data[i]._mean
			});
		}
		return processed_datapoints;
	}
	
	render() {	
		var start_month = this.props.dateRange.start_month;
		var start_year = this.props.dateRange.start_year;
		var end_month = this.props.dateRange.end_month;
		var end_year = this.props.dateRange.end_year;

		if (start_month === null) {
			start_month = 1;
		}

		if (end_month == null) {
			end_month = 12;
		}

		// For string formatting, the month must be length 2 and padded with a 0 if needed 
		if (start_month < 10) {
			start_month = "0" + start_month;
		}
		if (end_month < 10) {
			end_month = "0" + end_month
		}

		const options = {
			theme: "light2",
			animationEnabled: true,
			zoomEnabled: true,
			zoomType: "xy",
			title: {
				text: "ETa"
            },
            axisX: {
				valueFormatString: "MMM YYYY",
				viewportMinimum : new Date("" + start_year + "-" + start_month),
				viewportMaximum: new Date("" + end_year + "-" + end_month),
				
			},
			axisY: {
				title: "ETa"
			},
			data: [{
				type: "line",
				xValueFormatString: "MMM YYYY",
				dataPoints: this.extract_data(this.state.datapoints)
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options} 
				 onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
    
}
 
export default Graph;   