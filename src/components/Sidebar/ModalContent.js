import React, { Component } from 'react';

class ModalContent extends Component{
	render() {
		return (
			<div>
				<h5> Field ETa </h5>
				<ul>
					<p> View the individual field’s data over the selected time range, represented by a blue line. 
					This line can be hovered for a more precise value.
				  	</p>
				</ul>
			  
				<h5> Cohort Mean ETa </h5>
				<ul>
					<p> View the cohort’s mean data over the selected time range, represented by a grey line. 
						This line can also be hovered
					</p>
				</ul>
			  
				<h5> The Grey Shade </h5>
				<ul>
					<p> The two shadings represents one and two standard deviations from the mean.
					</p>
				</ul>
			
				<h5> Note </h5>
				<ul>
					<p>The graph can be zoomed by dragging and drawing a box over any portion.
					</p>
				</ul>
			</div> 
		);
	}
 }

export default ModalContent;
