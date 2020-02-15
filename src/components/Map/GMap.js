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
			clicked_categories: [],
			clicked_features: [],
			zoomLevel: 8,
			showMarkers: true,
			showMarker:	false,
			showPolygons: false
		};
		
		this.openSidebar = this.openSidebar.bind(this);
		this.handleZoomChanged = this.handleZoomChanged.bind(this);
		this.handleCenterChanged = this.handleCenterChanged.bind(this);
		this.ref = React.createRef();
		this.clicked_id = null;
		this.showMarkers= true;
		this.showPolygons= false;
		this.showMarker = false;
		this.zoomLevel = 8;
		this.mapPosition = { lat: 35.6163, lng: -119.6943 };
	}
	
	onPolyClick( open, id, categories, features, markersLocationLat, markersLocationLng){
		
		/*polygon.setOptions({fillColor: "#FFFF00" })*/
		this.markerPosition = {lat: markersLocationLat, lng:markersLocationLng};
		this.showMarker = true;
		this.setState(
			{ 
				markerPosition: {lat: markersLocationLat, lng:markersLocationLng},
				showMarker: true
			});
		
		this.openSidebar(open, id, categories, features)
		
	}
	openSidebar(open, id, categories, features) {
		
		this.clicked_id = id;
		
		this.setState(
			{ 
				sidebarVisibility: open, 
				clicked_categories: categories, 
				clicked_features: features,
				mapPosition: this.mapPosition
			});
	}

	onPositionChanged = (location) => {

		const newLocation = new window.google.maps.LatLng(location.lat, location.lng);
		// [NOTE]: try using the panTo() from googleMaps to recenter the map ? but don't know how to call it.

		return (
			<Marker
				position={newLocation}
			/>
		);
	}
	
	onPlaceSelected = ( place ) => {
		let latValue = place.geometry.location.lat(),
			lngValue = place.geometry.location.lng();
		this.mapPosition = { lat: latValue, lng: lngValue };
		this.zoomLevel = 15;
		this.showMarkers =  false;	
		this.showMarker = true;
		this.showPolygons = true
			
			
		// Set these values in the state.
		this.setState({
			
			zoomLevel: 15,
			showMarkers: false,	
			showPolygons: true,
			showMarker: true
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
	
	polygonMarker = () =>{
		return < Marker 
				onDragEnd={this.onMarkerDragEnd}
				position = {{lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
				icon = {{ url: "http://maps.google.com/mapfiles/kml/paddle/blu-blank.png"	}}
			  />
	}

	drawPolygons() {
		var polygons = []
		var markers = []
		var locations = []
		for (var i = 0; i < this.props.data.length; ++i) {

			const id = this.props.data[i].id;
			const categories = this.props.data[i].categories;
			const 	markersLocationLat = this.props.data[i].centroid[0],
					markersLocationLng =  this.props.data[i].centroid[1];
			const features = this.props.data[i].features;
			var colorPolygon = "#FFFFFF";  // default coloring
			
			//console.log("markersLocationLat: "+markersLocationLat)
			
			if (this.props.selectedFeature != null) {
				var feature_score = 0;
				var refs = 'polygon' + i;
				
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
						ref = {refs}
						key={this.props.data[i].id}
						path={this.props.data[i].coordinates.coordinates}
						options={{
							fillColor: colorPolygon,
							fillOpacity: 0.4,
							strokeColor: "FF0000",
							strokeOpacity: 1,
							strokeWeight: 1
						}}
						
						onClick={() => this.onPolyClick(true, id, categories, features, markersLocationLat, markersLocationLng) }
					/>
				);
				markers.push(
					<Marker
						key={this.props.data[i].id}
						/*onClick={() => this.openSidebar(true, id, categories, features)}*/
						position={{ lat: this.props.data[i].centroid[0], lng: this.props.data[i].centroid[1]}}
					/>

				);
			}
		}

		locations.push(polygons);
		locations.push(markers);

		return locations;
	};


	handleZoomChanged() {
		const zoomLevel = this.ref.current.getZoom();
		if (zoomLevel !== this.zoomLevel) {
			this.zoomLevel = zoomLevel;
		}

		if ( zoomLevel < 12 && !this.showMarkers && this.showPolygons ){
			this.showMarkers =  true;	
			this.showPolygons = false;
			this.showMarker = false

			this.setState({
				showMarkers: true,
				showPolygons: false,
				showMarker: false
			})
		}
		else if ( zoomLevel >= 12 && this.showMarkers && !this.showPolygons){
			this.showMarkers =  false;	
			this.showPolygons = true;
			this.showMarker = true
			
			this.setState({
				showMarkers: false,	
				showPolygons: true,
				showMarker: true
				
			})
		}
		
	}

	handleCenterChanged() {
		const center = this.ref.current.getCenter();

		if (center.lat() !== this.mapPosition.lat || center.lng() !== this.mapPosition.lng ) {
			this.mapPosition = { lat: center.lat(), lng: center.lng() };
		}
	}
		
	render() {
		var locations = this.drawPolygons();
		
		
		const defaultMapOptions = {
			fullscreenControl: false,
		};

		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap
						ref={this.ref}
						defaultZoom={this.zoomLevel}
						defaultCenter={{ lat: this.mapPosition.lat, lng: this.mapPosition.lng }}
						onZoomChanged={this.handleZoomChanged}
						onCenterChanged={this.handleCenterChanged}
						defaultOptions={defaultMapOptions}
					>
						{this.state.showMarkers &&	
							<MarkerClusterer
								onClick={this.onMarkerClustererClick}
								averageCenter
								enableRetinaIcons
								gridSize={60}
							>
								{locations[1]}
							
							</MarkerClusterer>
						}
						
						{this.state.showPolygons && 
							locations[0]
						}

						{this.placeBox()}
						{this.state.showMarker && this.polygonMarker()}
					

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
				   <div style={{ height: '100vh', position: 'relative' }} />
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
