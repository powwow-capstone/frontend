import React, { Component } from 'react';
import { compose, withProps, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, InfoWindow } from "react-google-maps"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import Sidebar from "../Sidebar/Sidebar";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";

const apiKey = process.env.REACT_APP_GOOGLE_KEY;

class GMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebarVisibility: false,
			markerPosition: {    lat: null,    lng: null  },
			mapPosition: {     lat: 35.6163,    lng: -119.6943   }
		};
		this.openSidebar = this.openSidebar.bind(this);
		this.clicked_id = null;
	}

	openSidebar(open, id) {
		this.clicked_id = id;
		this.setState({ sidebarVisibility: open });
	}
	
	
	shouldComponentUpdate( nextProps, nextState ){
		  if (
		   this.state.markerPosition.lat !== this.props.center.lat 
		  ) {
		   return true
		  } else if ( this.props.center.lat === nextProps.center.lat ){
		   return false
		  }
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
       style={{
        width: '100%',
        height: '40px',
        paddingLeft: '16px',
        marginTop: '2px',
        marginBottom: '100px'
       }}
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
			console.log(clickedMarkers.length);
		}

	openSidebar(open, id) {
		this.clicked_id = id;
		this.setState({ sidebarVisibility: open });
	}

	drawPolygons() {

		var polygons = []
		var markers = []
		var locations = []
		for (var i = 0; i < this.props.data.length; ++i) {

			const id = this.props.data[i].id;
			var colorPolygon = "#FFFFFF";  // default coloring
			if (this.props.selectedFeature != null) {
				var features = this.props.data[i].features;
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
						onClick={() => this.openSidebar(true, id)}
					/>
				);
				markers.push(
					<Marker
						key={this.props.data[i].id}
						onClick={() => this.openSidebar(true, id)}
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
	const AsyncMap = withScriptjs(
		withGoogleMap(
		props => (
			<GoogleMap
			defaultZoom={8}
			defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
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
	   <Sidebar clicked_id={this.clicked_id} isPaneOpen={this.state.sidebarVisibility} onClose={this.openSidebar} />
		 <AsyncMap
			  googleMapURL= {"https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=places"}
			  loadingElement={
			   <div style={{ height: `200%` }} />
			  }
			  containerElement={
			   <div style={{ height: '500px' }} />
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
