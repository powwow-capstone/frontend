import React, { Component } from 'react';
import CanvasJSReact from '../../canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
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
		const options = {
			theme: "light2",
			title: {
				text: "eta over time"
            },
            axisX: {
				valueFormatString: "MMM YYYY"
			},
			axisY: {
				title: "eta"
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