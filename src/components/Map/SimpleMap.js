import React, { Component } from 'react';
// import coordinates1 from '../../stubs/CoordinatesSB'
// import coordinates2 from '../../stubs/CoordinatesAlameda'
import axios from "axios";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, InfoWindow } from "react-google-maps"

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
	</GoogleMap>

)

class SimpleMap extends Component {
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
		var polygons = []
		for (var i = 0; i < this.state.fieldDataList.length; ++i) {
			var colorPolygon = "#FF0000"
			if (this.state.fieldDataList[i].efficiency == 1) {
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
		}

		return polygons;
	};

	drawInfoWindows = () => {
		var infoWindows = []
		for (var i = 0; i < this.state.fieldDataList.length; ++i) {
			if (i == 0)
			{
				console.log(this.state.fieldDataList[i].centroid);
			}
			infoWindows.push( 
				<InfoWindow
					defaultPosition={{ lng: this.state.fieldDataList[i].centroid, lat: this.state.fieldDataList[i].centroid }}
					>
					<h1 class="text">Here should be something useful </h1>
				</InfoWindow>
			);
		}
		return infoWindows

	}	

	render() {

		return (
			<div>
				<GMap polygons={this.drawPolygons()}
					// info={this.drawInfoWindows()} 
				/>
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