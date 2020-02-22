import React, { Component } from 'react';

class ModalContent extends Component{
	render() {
		return (
			<div>
				<h5> Field ETa </h5>
				<ul><p> info </p></ul>
			  
				<h5> Cohort Mean ETa </h5>
				<ul><p> info </p></ul>
			  
				<h5> The Darker Grey Shade </h5>
				<ul><p> It represents the range between one standard deviation below mean and one standard deviation above mean </p></ul>
			  
				<h5> The Lighter Grey Shade </h5>
				<ul><p> It represents the range between two standard deviations below mean and two standard deviations above mean </p></ul>
			
				<p><b>Tip:</b></p>
			</div> 
		);
	}
 }

export default ModalContent;
