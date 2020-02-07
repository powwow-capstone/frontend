import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import Sidebar from "../Sidebar/Sidebar";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import '../../css/GMap.css';

const apiKey = process.env.REACT_APP_GOOGLE_KEY;

class GMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebarVisibility: false,
			markerPosition: {    lat: null,    lng: null  },
			mapPosition: {     lat: 35.6163,    lng: -119.6943   },
			clicked_categories: [],
			clicked_features: []
		};
		this.openSidebar = this.openSidebar.bind(this);
		this.clicked_id = null;
	}

	openSidebar(open, id, categories, features) {
		this.clicked_id = id;
		this.setState({ sidebarVisibility: open, clicked_categories: categories, clicked_features: features });
		// this.setState({sidebarVisibility: open, clicked_categories: categories, clicked_features: features}, () => { 
		// 	// Do something here. 
		// 	console.log("categories after setstate finishes", this.state.clicked_categories);
		// });
	}
	
	onPlaceSelected = ( place ) => {
		  let latValue = place.geometry.location.lat(),
		   lngValue = place.geometry.location.lng();
		// Set these values in the state.
		  this.setState({
		   markerPosition: {
			lat: latValue,
			lng: lngValue
		   },
		   mapPosition: {
			lat: latValue,
			lng: lngValue
		   },
		  })
		 };
		 
	onMarkerDragEnd = ( event ) => {
		  let newLat = event.latLng.lat(),
		   newLng = event.latLng.lng();
			Geocode.fromLatLng( newLat , newLng ).then(
			   error => {
				console.error(error);
			   }
		  );
	};
	
	
	placeBox = () => {
	  return <Autocomplete
		className = "search-bar"
       	onPlaceSelected={ this.onPlaceSelected }
       	types={['(regions)']}
      />
	}
	
	locationMarker = () =>{
		return <Marker 
			draggable={true}
			 onDragEnd={this.onMarkerDragEnd}
			 position = {{lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
			 icon = {{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"	}}
		  />
	}

	onMarkerClustererClick = (markerClusterer) => {
		const clickedMarkers = markerClusterer.getMarkers()
	}

	drawPolygons() {
		var polygons = []
		var markers = []
		var locations = []
		for (var i = 0; i < this.props.data.length; ++i) {

			const id = this.props.data[i].id;
			const categories = this.props.data[i].categories;
			const features = this.props.data[i].features;
			var colorPolygon = "#FFFFFF";  // default coloring
			if (this.props.selectedFeature != null) {
				var feature_score = 0;

				for (var j = 0; j < features.length; j++) {
					if (features[j].name == this.props.selectedFeature) {
						feature_score = features[j].score;
						break;
					}
				}

				// Outside 2 standard deviations is within the 5th percentile or from the 95-100th percentile
				// Hard code this threshold for now
				if (feature_score == 1) {
					colorPolygon = "#00FF00";
				}
				else {
					colorPolygon = "#FF0000";
				}
			}

			var draw = true;
			if (this.props.data[i] == null || this.props.data[i].coordinates == null) {
				draw = false;
			}

			if (draw) {

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
						onClick={() => this.openSidebar(true, id, categories, features)}
					/>
				);
				markers.push(
					<Marker
						key={this.props.data[i].id}
						onClick={() => this.openSidebar(true, id, categories, features)}
						position={{ lat: this.props.data[i].centroid[0], lng: this.props.data[i].centroid[1] }}
					/>

				);
			}
		}

		locations.push(polygons);
		locations.push(markers);

		return locations;
	};




		
	render() {
	var locations = this.drawPolygons();

	const defaultMapOptions = {
		fullscreenControl: false,
	};

	const AsyncMap = withScriptjs(
		withGoogleMap(
		props => (
			<GoogleMap
			defaultZoom={8}
			defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
			defaultOptions={defaultMapOptions}
			>
				<MarkerClusterer
				onClick={this.onMarkerClustererClick}
				averageCenter
				enableRetinaIcons
				gridSize={60}
			>
				{locations[1]}
			
			</MarkerClusterer>
			
			{this.placeBox()}
			{this.locationMarker()}
			{locations[0]}

		</GoogleMap>
		
	)
)
  );


let map;
   map = <div>
	   <Sidebar clicked_id={this.clicked_id} categories={this.state.clicked_categories} features={this.state.clicked_features} isPaneOpen={this.state.sidebarVisibility} onClose={this.openSidebar} />
		 <AsyncMap
			  googleMapURL= {"https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=places"}
			  loadingElement={
			   <div style={{ height: `200%` }} />
			  }
			  containerElement={
			   <div style={{ height: '500px', position: 'relative' }} />
			  }
			  mapElement={
			   <div style={{ height: `100%` }} />
			  }
		/> 
			 
		
    </div>
	return (map);
 }
}

GMap.defaultProps = {
	selectedFeature: null
}


export default GMap;
