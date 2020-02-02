import React, { Component } from 'react';
import axios from "axios";
import { compose, withProps, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, InfoWindow } from "react-google-maps"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import Sidebar from "../Sidebar/Sidebar";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";

const apiKey = process.env.REACT_APP_GOOGLE_KEY;

/*
const GMap = compose(
	withProps({
		googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + apiKey,
		loadingElement: <div style={{ height: `200%` }} />,
		containerElement: <div style={{ height: `500px` }} />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withHandlers({
		onMarkerClustererClick: () => (markerClusterer) => {
			const clickedMarkers = markerClusterer.getMarkers()
			console.log(clickedMarkers.length);
		},
	}),
	withScriptjs,
	withGoogleMap

)((props) =>
	<GoogleMap defaultZoom={8} defaultCenter={{ lat: 34.4717, lng: -120.2149 }}>
		<MarkerClusterer
      		onClick={props.onMarkerClustererClick}
      		averageCenter
      		enableRetinaIcons
      		gridSize={60}
    	>
      		{props.markers}
    	</MarkerClusterer>
		{props.polygons}
	</GoogleMap>	
		
)*/

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fieldDataList: [],
			sidebarVisibility: false,
			markerPosition: {    lat: null,    lng: null  },
			mapPosition: {     lat: 35.6163,    lng: -119.6943   }
		};
		this.openSidebar = this.openSidebar.bind(this);
	}
	componentDidMount() {
		this.refreshList();
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
		  console.log( 'event', event );
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
	refreshList() {
		axios
			.get( "https://space-monitor-backend.herokuapp.com/api/fields")
			.then(res => this.setState({ fieldDataList: res.data }))
			.catch(err => console.log(err));
	};
	onMarkerClustererClick = (markerClusterer) => {
			const clickedMarkers = markerClusterer.getMarkers()
			console.log(clickedMarkers.length);
		}

	openSidebar(open) {
		this.setState({ sidebarVisibility: open });
	}

	drawPolygons() {
		console.log(this.state.fieldDataList);
		var polygons = []
		var markers = []
		var locations = []
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
					onClick={() => this.openSidebar(true) }
				/>
			);
			markers.push(
				<Marker
					key={this.state.fieldDataList[i].id}
					onClick={() => this.openSidebar(true)}
					position={{ lat: this.state.fieldDataList[i].centroid[0], lng: this.state.fieldDataList[i].centroid[1]}}
				/>

			);
		}

		locations.push(polygons);
		locations.push(markers);

		return locations;
	};

	drawInfoWindows = () => {
		var infoWindows = []
		for (var i = 0; i < this.state.fieldDataList.length; ++i) {
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
		var locations = this.drawPolygons();
		const AsyncMap = withScriptjs(
		   withGoogleMap(
			props => (
			 <GoogleMap google={this.props.google}
			  defaultZoom={this.props.zoom}
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
		<Sidebar isPaneOpen={this.state.sidebarVisibility} onClose={this.openSidebar}/>
		 <AsyncMap
			  googleMapURL= {"https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"}
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
	return(map)
 }
}
export default Map;

/*
					<Sidebar isPaneOpen={this.state.sidebarVisibility} onClose={this.openSidebar}/>

					<GMap polygons={locations[0]} markers={locations[1]}/>
					
				</div>
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
*/