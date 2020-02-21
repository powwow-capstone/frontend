import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Polyline } from "react-google-maps"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import Sidebar from "../Sidebar/Sidebar";
import Autocomplete from 'react-google-autocomplete';
import ColorCohorts from '../../components/Filtering/ColorCohorts'
import '../../css/GMap.css';
import distinctColors from 'distinct-colors'
import Loader from '../Loader/Loader';

const apiKey = process.env.REACT_APP_GOOGLE_KEY;

class GMap extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			sidebarVisibility: false,
			clicked_categories: [],
			clicked_features: [],
			clicked_cohort_ids: [],
			zoomLevel: 8,
			showMarkers: true,
			showPolyborder: false,
			showPolygons: false,
			polygon_coloring_feature: props.selectedFeature,  // This is the feature that will determine coloring of polygons
			colorCohorts : false,
		};
		
		this.openSidebar = this.openSidebar.bind(this);
		this.handleZoomChanged = this.handleZoomChanged.bind(this);
		this.handleCenterChanged = this.handleCenterChanged.bind(this);
		this.changeColoringOption = this.changeColoringOption.bind(this);
		this.ref = React.createRef();
		this.clicked_id = null;
		this.showMarkers= true;
		this.showPolygons= false;
		this.clicked_i = null;
		this.zoomLevel = 8;
		this.mapPosition = { lat: 35.6163, lng: -119.6943 };
	}

	componentDidUpdate(prevProps) {

		// Force a rerender when the data changes or when the user switches the coloring option
		if (prevProps.data !== this.props.data ) {
            this.setState({ showPolyborder: false })
        }
		if (this.state.polygon_coloring_feature !== this.props.selectedFeature) {
			this.setState({ polygon_coloring_feature : this.props.selectedFeature })
		}
	}
	
	
	onPolyClick( open, id, group_id, categories, features, clicked_i){
		this.clicked_i = clicked_i;
		const cohort_ids = this.getPolygonCohort(group_id);
		this.setState({showPolyborder: true});
		this.openSidebar(open, id, cohort_ids, categories, features)
	}

	getPolygonCohort(groupid) {
		// Given a groupid, return a list of all ids of polygons that belong to that same cohort
		var cohort_ids = [];
		if (this.props.data !== null)
		{
			for (var i = 0; i < this.props.data.length; ++i)
			{
				if (groupid === this.props.data[i].groupid)
				{
					cohort_ids.push(this.props.data[i].id);
				}
			}
		}
		return cohort_ids;
	}

	openSidebar(open, id, cohort_ids, categories, features) {		
		this.clicked_id = id;
		this.setState(
			{ 
				sidebarVisibility: open, 
				clicked_categories: categories, 
				clicked_features: features,
				clicked_cohort_ids: cohort_ids,
				mapPosition: this.mapPosition
			});
	}

	changeColoringOption() {
		var newColoringOption = !this.state.colorCohorts;
		this.setState({ colorCohorts: newColoringOption });
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

		var distinct_colors = {}
		var num_groups = 0;
		// Iterate through all the data once to determine how many distinct groups there are
		for (var k = 0; k < this.props.data.length; ++k) {
			const groupid = this.props.data[k].groupid;
			if (! (groupid in distinct_colors) ) {
				distinct_colors[groupid] = null;
				num_groups += 1;
			}
		}
		
		var palette_iterator = 0;
		var palette = distinctColors({ count : num_groups });

		for (var i = 0; i < this.props.data.length; ++i) {

			const id = this.props.data[i].id;
			const groupid = this.props.data[i].groupid;

			if (distinct_colors[groupid] === null) {
				distinct_colors[groupid] = palette[palette_iterator];
				++palette_iterator;
			}

			const categories = this.props.data[i].categories;
			const clicked_i = i;
			const features = this.props.data[i].features;

			var colorPolygon = "#FFFFFF";  // default coloring
			
			// You will either color based on the cohort or based on the outlier
			if (this.state.colorCohorts) {
				colorPolygon = distinct_colors[groupid];
			}
			else {
			
				if (this.state.polygon_coloring_feature !== null) {
					var feature_score = 0;
					var refs = 'polygon' + i;
					
					for (var j = 0; j < features.length; j++) {
						if (features[j].name === this.state.polygon_coloring_feature) {
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
						

						onClick={() => this.onPolyClick(true, id, groupid, categories, features, clicked_i) }
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

		var locations = this.drawPolygons();
		
		const defaultMapOptions = {
			fullscreenControl: false,
		};

		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<div>
						<Loader loading={this.props.loading}/>
						{this.props.loading===false && 
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
							<ColorCohorts handleClick={this.changeColoringOption} colorCohorts={this.state.colorCohorts} />
							{this.state.showPolyborder && this.clicked_i && this.polygonBorder(this.clicked_i)}
						
						</GoogleMap>}
					</div>
				)
			)
		);


	let map;
	   map = <div>
		   <Sidebar clicked_id={this.clicked_id} clicked_cohort_ids={this.state.clicked_cohort_ids} categories={this.state.clicked_categories} features={this.state.clicked_features} isPaneOpen={this.state.sidebarVisibility} onClose={this.openSidebar} dateRange={this.props.dateRange} />
			 <AsyncMap
				  googleMapURL= {"https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=places"}
				  loadingElement={
				   <div style={{ height: `100vh` }} />
				  }
				  containerElement={
				   <div style={{ height: '100vh', position: 'relative' }} />
				  }
				  mapElement={
				   <div style={{ height: `100vh` }} />
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
