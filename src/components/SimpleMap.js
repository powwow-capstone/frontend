import React, { Component } from 'react';
import coordinates1 from './CoordinatesSB'
import coordinates2 from './CoordinatesAlameda'
import axios from "axios";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker,Polygon } from "react-google-maps"

var apiKey = process.env.REACT_APP_GOOGLE_KEY;

const GMap = compose(
    withProps({
		googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + apiKey,
        loadingElement: <div style={{ height: `200%` }} />,
        containerElement: <div style={{ height: `500px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap

)((props) =>
	<GoogleMap defaultZoom={8} defaultCenter={{ lat: 34.4717, lng: -120.2149 }}>
		{props.polygons}
		{props.markers}
	</GoogleMap>	
		
)

class SimpleMap extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			fieldDataList: []
		};
	}
	componentDidMount() {
		this.refreshList();
	}
	refreshList = () => {
		axios
			.get("https://space-monitor-backend.herokuapp.com/api/fields")
			.then(res => this.setState({ fieldDataList: res.data }))
			.catch(err => console.log(err));
	};
	drawPolygons = () => {
		console.log(this.state.fieldDataList);
		var polygons = []
		var markers = []
		var locations = []
		for (var i = 0; i < this.state.fieldDataList.length; ++i) {
			var colorPolygon = "#FF0000"
			if (this.state.fieldDataList[i].efficiency == 1)
			{
				colorPolygon = "#00FF00";
			}
			polygons.push(
				<Polygon
					key={this.state.fieldDataList[i].id}
					path={this.state.fieldDataList[i].coordinates.coordinates}
					options={{
						fillColor: colorPolygon,
						fillOpacity: 0.4,
						strokeColor: "FF0000",
						strokeOpacity: 1,
						strokeWeight: 1
					}}
				/>
			);
			markers.push(
				<Marker
					key={this.state.fieldDataList[i].id}
					position={{ lat: this.state.fieldDataList[i].centroid[0], lng: this.state.fieldDataList[i].centroid[1]}}
				/>

			);
		}

		locations.push(polygons);
		locations.push(markers);

		console.log(locations);

		return locations;
	};

	render() {

		var locations = this.drawPolygons();

		return (
			<div>
				<GMap polygons={locations[0]} markers={locations[1]}/>
				<div className="btn-group dropright mt-2 mr-2">
					<button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
						Filter by Crop
					</button>
					<div className="dropdown-menu">
						<button className="dropdown-item" type="button">Almond</button>
						<button className="dropdown-item" type="button">Pistachio</button>
						<button className="dropdown-item" type="button">Something</button>
					</div>
				</div>

				<div className="btn-group dropright mt-2">
					<button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
						Filter by Year
					</button>
					<div className="dropdown-menu">
						<button className="dropdown-item" type="button">year1</button>
						<button className="dropdown-item" type="button">year2</button>
						<button className="dropdown-item" type="button">year3</button>
					</div>
				</div>
			</div>
			
		)
	}
}

export default SimpleMap;