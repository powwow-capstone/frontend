import React, { Component } from 'react';
import Map from './Map';

class SimpleMap extends Component {

	render() {
		return(
			<div style = {{width: '180vh', height: '70vh'}}>
				<Map
					google={this.props.google}
					center={{    lat: 34.4208,    lng: -119.6982  }}
					height='300px'
					zoom={7}
				/>
			</div>
		);
	}
}

export default SimpleMap;