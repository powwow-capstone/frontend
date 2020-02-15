import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline } from "react-google-maps"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import Sidebar from "../Sidebar/Sidebar";
import Autocomplete from 'react-google-autocomplete';
import '../../css/GMap.css';

const apiKey = process.env.REACT_APP_GOOGLE_KEY;

class GMap extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			sidebarVisibility: false,
			clicked_categories: [],
			clicked_features: [],
			zoomLevel: 8,
			showMarkers: true,
			showPolyborder: false,
			showPolygons: false,
			polygon_coloring_feature: props.selectedFeature,  // This is the feature that will determine coloring of polygons

		};
		
		this.openSidebar = this.openSidebar.bind(this);
		this.handleZoomChanged = this.handleZoomChanged.bind(this);
		this.handleCenterChanged = this.handleCenterChanged.bind(this);
		this.ref = React.createRef();
		this.clicked_id = null;
		this.showMarkers= true;
		this.showPolygons= false;
		this.clicked_i = null;
		this.zoomLevel = 8;
		this.mapPosition = { lat: 35.6163, lng: -119.6943 };
	}

	componentDidUpdate(prevProps) {
		console.log("component did update");
		if (this.state.polygon_coloring_feature !== this.props.selectedFeature) {
			this.setState({ polygon_coloring_feature : this.props.selectedFeature })
		}
	}
	
	onPolyClick( open, id, categories, features, clicked_i){
		this.clicked_i = clicked_i;
		this.setState({showPolyborder: true});
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

	
	onPlaceSelected = ( place ) => {
		let latValue = place.geometry.location.lat(),
			lngValue = place.geometry.location.lng();
		this.mapPosition = { lat: latValue, lng: lngValue };
		this.zoomLevel = 15;
		this.showMarkers =  false;	
		this.showPolygons = true
			
			
		// Set these values in the state.
		this.setState({
			
			zoomLevel: 15,
			showMarkers: false,	
			showPolygons: true
		})

	};
	
	
	placeBox = () => {
	  return <Autocomplete
		className = "search-bar"
       	onPlaceSelected={ this.onPlaceSelected }
       	types={['(regions)']}
      />
	}
	

	polygonBorder(clicked_i) {
		return <Polyline
				path={this.props.data[clicked_i].coordinates.coordinates}
				geodesic={false}
				options={{
				strokeColor: "#000000",
				strokeOpacity: 1.0,
          		strokeWeight: 5
				}}
		/>
	}

	drawPolygons() {
		var polygons = []
		var markers = []
		var locations = []
		for (var i = 0; i < this.props.data.length; ++i) {

			const id = this.props.data[i].id;
			const categories = this.props.data[i].categories;
			const clicked_i = i;
			const features = this.props.data[i].features;
			var colorPolygon = "#FFFFFF";  // default coloring
			
			if (this.state.polygon_coloring_feature !== null) {
				var feature_score = 0;
				var refs = 'polygon' + i;
				
				for (var j = 0; j < features.length; j++) {
					if (features[j].name == this.state.polygon_coloring_feature) {
						feature_score = features[j].score;
						break;
					}
				}

				// Outside 2 standard deviations is within the 5th percentile or from the 95-100th percentile
				// Hard code this threshold for now
				if (feature_score >= 0)
				{
					if (feature_score === 1) {
						colorPolygon = "#00FF00";
					}
					else {
						colorPolygon = "#FF0000";
					}
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
							strokeColor: "#808080",
							strokeOpacity: 1,
							strokeWeight: 1
						}}
						
						onClick={() => this.onPolyClick(true, id, categories, features, clicked_i) }
					/>
				);
				markers.push(
					<Marker
						key={this.props.data[i].id}
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

			this.setState({
				showMarkers: true,
				showPolygons: false,
				showPolyborder: false
			})
		}
		else if ( zoomLevel >= 12 && this.showMarkers && !this.showPolygons){
			this.showMarkers =  false;	
			this.showPolygons = true;
			
			this.setState({
				showMarkers: false,	
				showPolygons: true
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
		console.log("render map");
		console.log(this.state.polygon_coloring_feature);

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
						{this.state.showPolyborder && this.polygonBorder(this.clicked_i)}
					

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
