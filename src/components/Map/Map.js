import React,  { Component, useState, setState, state }  from 'react';
import coordinatesSB from './CoordinatesSB'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker,Polygon } from "react-google-maps"
import "./styles.css";
import Sidebar from "react-sidebar";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
/*
const GMap = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=KEY_NEEDED&libraries=places&callback=myCallbackFunc", //+ apiKey,
        loadingElement: <div style={{ height: `50vh` }} />,
        containerElement: <div style={{ height: `50vh` }} />,
        mapElement: <div style={{ height: `50vh` }} />,
    }),
    withScriptjs,
    withGoogleMap

)((props) =>
	<GoogleMap defaultZoom={7} center={{ lat: 34.4208,    lng: -119.6982  }} >
		{props.polygons}
		{props.markers}
		{props.autocomplete1}
		{props.locationMarker}
	</GoogleMap>	
		
)*/

class Map extends Component{
	constructor(props) {
		super(props);
		this.state={
			sidebarOpen: false,
			markerPosition: {    lat: null,    lng: null  },
			mapPosition: {    lat: 34.4208,    lng: -119.6982  }
		};
		 this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
		 
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
	
	onSetSidebarOpen(open) {
		this.setState({ sidebarOpen: open });
	  };
	drawPolygons = () => {
		return   <Polygon
					path={coordinatesSB}
					options={{
						fillColor: "#FF0000",
						fillOpacity: 0.4,
						strokeColor: "FF0000",
						strokeOpacity: 1,
						strokeWeight: 1
					}} 
					onClick = {() => this.onSetSidebarOpen(true)}
					/>;
				
				
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
	
	placeMarkers = () => {
		return <Marker 
				position = {{lat: 34.4208,	lng: -119.6982}}
				onClick = {() => this.onSetSidebarOpen(true)}
				icon = {{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"	}}
			  />
	}
	
	
	locationMarker = () =>{
		return <Marker 
			draggable={true}
			 onDragEnd={this.onMarkerDragEnd}
			 position = {{lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
			
		  />
	}
	

	render() {
	const AsyncMap = withScriptjs(
	   withGoogleMap(
		props => (
		 <GoogleMap google={this.props.google}
		  defaultZoom={this.props.zoom}
		  defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
		 >
		 <Autocomplete
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
		   <Marker 
			draggable={true}
			 onDragEnd={this.onMarkerDragEnd}
			 position = {{lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
			
		  />
		  <Polygon
					path={coordinatesSB}
					options={{
						fillColor: "#FF0000",
						fillOpacity: 0.4,
						strokeColor: "FF0000",
						strokeOpacity: 1,
						strokeWeight: 1
					}} 
					onClick = {() => this.onSetSidebarOpen(true)}
					/>
			<Marker 
				position = {{lat: 34.4208,	lng: -119.6982}}
				onClick = {() => this.onSetSidebarOpen(true)}
				icon = {{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"	}}
			  />
			  </GoogleMap>
)
   )
  );
let map;
   map = <div>
		<Sidebar 
				sidebar={<h2>Sidebar content</h2>}
				open={this.state.sidebarOpen}
				onSetOpen={this.onSetSidebarOpen}
				styles={{ sidebar: { 
							background: "white",
							width: 300
						  } 
						}}>
		 <AsyncMap
			  googleMapURL="https://maps.googleapis.com/maps/api/js?key=KEY_NEEDED&libraries=places"
			  loadingElement={
			   <div style={{ height: `100%` }} />
			  }
			  containerElement={
			   <div style={{ height: this.props.height }} />
			  }
			  mapElement={
			   <div style={{ height: `100%` }} />
			  }
			 /> 
			 
		</Sidebar>
    </div>
	return(map)
 }
}
export default Map;
