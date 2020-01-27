import React from 'react';
import { Component } from 'react';
import Analysis from '../../components/Report/Analysis'
import SimpleMap from '../../components/Map/SimpleMap'
import imageLogo from '../../images/imageLogo.png';
import axios from "axios";
import field_stub from '../../stubs/field_stub'
import CategoryFiltering from '../../components/Filtering/CategoryFiltering';
import FeatureSelection from '../../components/Filtering/FeatureSelection';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {

      data: field_stub,            // This contains all data from the server
      displayed_data : field_stub, // This contains a subset of data that will be displayed on the map
      features: [],
      categories: {},
      category_visibility: {}
    };
  }

  componentDidMount() {
    // this.loadData();
  };


  loadData() {
    axios
      .get("http://localhost:5000/api/fields")
      .then(res => this.setState({ data: res.data, displayed_data: res.data }))
      .catch (err => console.log(err));
  }

  getAllUniqueFeatures() {
    // Extract all the different features from the data
    // All data should have the same features, so all the different feature labels can be found
    // from the first element of this.state.data
    if (this.state.data.length > 0)
    {
      var features = this.state.data[0].features;
      var feature_labels = []
      for(var i = 0; i < features.length; ++i)
      {
        feature_labels.push( features[i].name );
      }

      this.setState({features : feature_labels}) 
    }
  }

  createFeatureRadioButtons() {
    var feature_buttons = [];
    for(var i = 0; i < this.state.features.length; ++i)
    {
      feature_buttons.push(
        <div className="radio">
          <label>
            <input type="radio" name="features" value={this.state.features[i]} />
              {this.state.features[i]}
            </label>
        </div>
      );
    }

    return feature_buttons;
  }

  render() {
    return (
        <div className="mt-5">
          <div className="row">

            <div className="col-md-9">
              <SimpleMap data={this.state.displayed_data}/>
            </div>
            <div className="col-md-3">
              <div className="col-12">
                  <img src={imageLogo} alt="Logo" className="fixed_img center" />
              </div>
              <div className="col-12">
                <Analysis  />
              </div>
            
              <CategoryFiltering data={this.state.data}/>
              <FeatureSelection data={this.state.data} />

            </div>
          </div>
        </div>
    );
    
  }
}

export default Home;