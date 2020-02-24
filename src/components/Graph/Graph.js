import React, { Component } from 'react';
import CanvasJSReact from '../../canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Graph extends Component {
 
    constructor(props) {
		super(props);
		this.state = {
			datapoints: [],
			cohort_datapoints: []
		};
		this.chart = React.createRef();
    }
	
	static getDerivedStateFromProps(nextProps, prevState) {
        return {
			datapoints: nextProps.datapoints,
			cohort_datapoints: nextProps.cohort_datapoints,
        };
	}

	extract_stdev(stdev) {
		var stdev_datapoints = [];
		for (var j = 0; j < this.state.cohort_datapoints.length; ++j) {
			stdev_datapoints.push({
				x: new Date(this.state.cohort_datapoints[j].date),
				y: [this.state.cohort_datapoints[j]._mean + (-1 * stdev * this.state.cohort_datapoints[j]._stdev),
					this.state.cohort_datapoints[j]._mean + (stdev * this.state.cohort_datapoints[j]._stdev)],
			});
		}
		return stdev_datapoints;
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

	toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
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

		var options = {
			theme: "light2",
			animationEnabled: true,
			zoomEnabled: true,
			zoomType: "xy",
			title: {
				text: "Graph of Weekly Totals"
			},
			legend: {
				cursor: "pointer",
				verticalAlign: "top",
				horizontalAlign: "center",
				dockInsidePlotArea: true,
				itemclick: this.toggleDataSeries
			},
            axisX: {
				valueFormatString: "MMM YYYY",
				minimum: new Date("" + start_year + "-" + start_month),
				maximum: new Date("" + end_year + "-" + end_month),
				
			},
			axisY: {
				title: "ETa (inches)"
			},
			data: [
				{
					type: "rangeArea",
					toolTipContent: null,
					highlightEnabled: false,
					color: "#dedcdc",
					fillOpacity: 1,
					markerSize: 0,
					xValueFormatString: "MMM YYYY",
					dataPoints: this.extract_stdev(2)
				},
				{
					type: "rangeArea",
					toolTipContent: null,
					highlightEnabled: false,
					color: "#bfbfbf",
					fillOpacity: 1,
					markerSize: 0,
					xValueFormatString: "MMM YYYY",
					dataPoints: this.extract_stdev(1)
				},
				{
					type: "line",
					name: "Field ETa",
					lineColor: "blue",
					showInLegend: true,
					xValueFormatString: "MMM YYYY",
					dataPoints: this.extract_data(this.state.datapoints)
				},
				{
					type: "line",
					name: "Cohort Mean ETa",
					lineColor: "#595957",
					showInLegend: true,
					xValueFormatString: "MMM YYYY",
					dataPoints: this.extract_data(this.state.cohort_datapoints)
				},
			]
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