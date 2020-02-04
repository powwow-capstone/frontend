import React, { Component } from 'react';
import Map from './Map';

class SimpleMap extends Component {

	render() {
		return(
			<div style = {{width: '180vh', height: '70vh'}}>
				<Map
					center={{    lat: 35.6163,    lng: -119.6943  }}
					height='300px'
					zoom={9}
				/>
			</div>
		);
	}
}

export default SimpleMap;