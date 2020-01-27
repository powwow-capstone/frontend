import React, { Component } from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import Sidebar from "react-sidebar";

var apiKey = process.env.REACT_APP_GOOGLE_KEY;

const GMap = compose(
	withProps({
		googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + apiKey,
		loadingElement: <div style={{ height: `200%` }} />,
		containerElement: <div style={{ height: `100%` }} />,
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

class SimpleMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebarVisibility: false
		};
		this.openSidebar = this.openSidebar.bind(this);
	
	}

	

	openSidebar(open) {
		this.setState({ sidebarVisibility: open });
	}

	drawPolygons() {

		// console.log(this.props.data);

		var polygons = []
		var markers = []
		var locations = []
		for (var i = 0; i < this.props.data.length; ++i) {
			
			var colorPolygon = "#FFFFFF";  // default coloring
			if (this.props.selectedFeature != null)
			{
				var features = this.props.data[i].features;
				var feature_value = 0;
				for (var j = 0; j < features.length; j++)
				{
					if (features[j].name == this.props.selectedFeature)
					{
						feature_value = features[j].value;
						break;
					}
				}

				// Outside 2 standard deviations is within the 5th percentile or from the 95-100th percentile
				if (feature_value <= 5 || feature_value >= 95) {
					colorPolygon = "#00FF00";
				}
				else {
					colorPolygon = "#FF0000";
				}
			}
			
			var draw = true;

			if (draw)
			{

				polygons.push(
					<Polygon
						key={this.props.data[i].id}
						path={this.props.data[i].coordinates.coordinates}
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
						key={this.props.data[i].id}
						onClick={() => this.openSidebar(true)}
						position={{ lat: this.props.data[i].centroid[0], lng: this.props.data[i].centroid[1]}}
					/>

				);
			}
		}

		locations.push(polygons);
		locations.push(markers);

		return locations;
	};

	

	render() {

		console.log("Render map");
		var locations = this.drawPolygons();

		return (
			<div>
				<div style={{ width: '100%', height: '90vh' }}>
					<Sidebar
						sidebar={<h2>Sidebar content</h2>}
						open={this.state.sidebarVisibility}
						onSetOpen={this.openSidebar}
						styles={{
							sidebar: {
								background: "white",
								width: 300
							}
						}}> 
						<GMap polygons={locations[0]} markers={locations[1]}/>
					</Sidebar>
				</div>
			</div>

		)
	}
}

SimpleMap.defaultProps = {
	selectedFeature: null
}

export default SimpleMap;