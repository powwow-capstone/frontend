import React, { Component } from 'react';
import CanvasJSReact from '../../canvasjs.react';
import axios from "axios";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Graph extends Component {
 
    constructor(props) {
		super(props);
		this.state = {
			dataPoints: []
		};
    }
    
	render() {	
		const options = {
			theme: "light2",
			title: {
				text: "eta over time"
            },
            axisX: {
				valueFormatString: "MMM"
			},
			axisY: {
				title: "eta"
			},
			data: [{
				type: "line",
				xValueFormatString: "MMMM",
				dataPoints: this.state.dataPoints
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
    
    refreshList() {
		axios
			.get( "../../stubs/eta.js")
			.then(res => this.setState({ dataPoints: res.data }))
			.catch(err => console.log(err));
    };
    
	componentDidMount(){
		var chart = this.chart;
        this.refreshList();
        console.log("datapoints", this.state.dataPoints);
		// .then(function(data) {
		// 	for (var i = 0; i < data.length; i++) {
		// 		dataPoints.push({
		// 			x: new Date(data[i].x),
		// 			y: data[i].y
		// 		});
        //     }
        //     console.log("data points", dataPoints);
		// 	chart.render();
        // });
        
	}
}
 
export default Graph;   