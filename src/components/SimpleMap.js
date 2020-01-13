import React, { Component, useState, setState, state } from 'react';
import axios from "axios";
import { compose, withProps } from "recompose"
import ReactMapboxGl, { GeoJSONLayer, Popup, Marker } from "react-mapbox-gl"	 
import ReactDOM from 'react-dom'
import geojsonObject from "./result.json";
import "./styles.css";

const position = [-119.12841033320983, 35.63854513496408];

const Map = ReactMapboxGl({
  accessToken: "KEY"
});

const polygonPaint = {
	  'fill-color': '#6F788A',
	  'fill-opacity': 0.7
	};

class SimpleMap extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			showPopup: false
		};
	}

  myClick(){
	  this.setState ({
		  showPopup: !this.state.showPopup
	  });
  }

 
	render(){
	return (
    <div>
	 <Map			
            style="mapbox://styles/anna0864/ck38d6jyg1uly1cmw485a4qhe"
            center={position}
			zoom = {[15]}
            containerStyle={{ height: "40vh", width: "40vw" , zoom: 2}}
			
		>

		   <GeoJSONLayer
			   id = "poly"
			   type = "geojsonObject"
			   data={geojsonObject}
				
			   fillPaint={{
                "fill-color": "#ff0000"
              }}
			  lineOnClick  = {this.myClick.bind(this)}/>
			  
			<Marker
			  coordinates={position}
			  anchor="bottom"
			  onClick = {this.myClick.bind(this)}>
			  <div class="mapMarkerStyle"></div>
			</Marker>
			
			{this.state.showPopup && <Popup
			  coordinates={position}
			  offset={{
				'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
			  }}
			  OnClick={this.myClick.bind(this)}>
			  <h1>Popup</h1>
			</Popup>}	 
				
		</Map>	
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
	

	);
	}
}
{/*
var apiKey = process.env.GOOGLE_KEY;

const GMap = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2zir3KVWBzE4GjkMN_x9RDrp_uEKCboU", //+ apiKey,
        loadingElement: <div style={{ height: `200%` }} />,
        containerElement: <div style={{ height: `500px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap

)((props) =>
	<GoogleMap defaultZoom={7} defaultCenter={{ lat: 34.4208, lng: -119.6982 }}>
		{props.polygons}
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
			.get("http://192.168.99.100:5000/field")
			.then(res => this.setState({ fieldDataList: res.data }))
			.catch(err => console.log(err));
	};
	drawPolygons = () => {
		var polygons = []
		for (var i = 0; i < this.state.fieldDataList.length; ++i) {
			polygons.push(
				<Polygon
					key={this.state.fieldDataList[i].id}
					path={this.state.fieldDataList[i].coordinates.coordinates}
					options={{
						fillColor: "#FF0000",
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

	render() {

		return (
			<div>
				<GMap polygons={this.drawPolygons()} />
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
ReactDOM.render(
  <SimpleMap />,
  document.getElementById("SimpleMap")
)*/}
export default SimpleMap;