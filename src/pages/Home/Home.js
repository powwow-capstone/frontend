import React from 'react';
import { Component } from 'react';
import Analysis from '../../components/Report/Analysis'
import SimpleMap from '../../components/Map/SimpleMap'
import imageLogo from '../../images/imageLogo.png';
import axios from "axios";
import field_stub from '../../stubs/field_stub'

console.log("Field stub:");
console.log(field_stub);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {

      // Stub the data while the server is down
      data: field_stub,
      features: [],
      categories: {},
      category_selection: {}
    };
  }

  componentDidMount() {
    // this.loadData();

    this.getAllUniqueFeatures();
    this.getAllCategories();
    console.log("Categories:");
    console.log(this.state.categories);
  };

  handleChange() {
    console.log("CHANGE!");
  }

  loadData() {
    axios
      .get("http://localhost:5000/api/fields")
      .then(res => this.setState({ data: res.data }))
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

  getAllCategories() {

    if (this.state.data.length > 0)
    {
      var category_id = 1;
      var category_selection = {}
      var category_labels = {};
      for(var i = 0; i < this.state.data; ++i)
      {        

        var categories = this.state.data[i].categories;
        for (var j = 0; j < categories.length; ++j)
        {
          if ( ! (categories[j].category_name in category_labels ) )
          {
            category_labels[categories[j].category_name] = {}; 
            category_labels[categories[j].category_name]["type"] = categories[j].type;
            category_labels[categories[j].category_name]["values"] = [];
            category_labels[categories[j].category_name]["id"] = category_id;
            category_selection[category_id] = false;
            category_id = category_id + 1;
          }
          var category_val = categories[j].value;
          if (!(category_val in category_labels[categories[j].category_name]["values"]) )
          {
            category_labels[categories[j].category_name]["values"].push(category_val);
          }
        }
      }

      this.setState(
        {
          categories : category_labels,
          category_selection : category_selection
        }
      );
    }
  }

  /*
  createCategoryCheckboxes()
  {
    
    var category_checkboxes = [];
    for( var category_name in this.state.categories)
    {
      category_checkboxes.push(
        <input type="checkbox" onChange={this.handleChange} />
      );
      category_checkboxes.push(
        category_name
      ); 
      var type = this.state.categories[category_name]["type"];
      var values = this.state.categories[category_name]["values"];
      var id = this.state.categories[category_name]["id"];

      if (type == "string")
      {
        // For strings, each checkbox has a dropdown menu
        category_checkboxes.push(
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
        ); 
        var dropdown_options = []
        for (var i = 0; i < values.length; ++i) {
          dropdown_options.push(
            <a class="dropdown-item" href="#">values[i]</a>
          ); 
        }
        category_checkboxes.push(
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">dropdown_options</div>
        );

      }
      else
      {
        // For ints, the user inputs a min and a max
        category_checkboxes.push(
          <div>
            <div className="row">
              Min: <input type="Text" id="num2" />
            </div>
            <div className="row">
              Max: <input type="Text" id="num3" />
            </div>
          </div>
        ); 
      }
      
    }

    return category_checkboxes;
    
  }
  */

  createFeatureRadioButtons() {
    var feature_buttons = [];
    for(var i = 0; i < this.state.features.length; ++i)
    {
      feature_buttons.push(
        <div className="radio">
          <label>
            <input type="radio" value={this.state.features[i]} checked={false} />
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
              <SimpleMap data={this.state.data}/>
            </div>
            <div className="col-md-3">
              <div className="col-12">
                  <img src={imageLogo} alt="Logo" className="fixed_img center" />
              </div>
              <div className="col-12">
                <Analysis  />
              </div>
            <div></div>
                <div className="col-12">
                  <div className="card">
                    <h5 className="card-header">Categories</h5>
                    <div className="card-body">
                      <div className="card-text">
                        <form>

                          <div className="row">
                          <input type="checkbox" id="myCheck" onChange={this.handleChange}/>
                            Crop <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                              <a class="dropdown-item" href="#">Oranges</a>
                              <a class="dropdown-item" href="#">Almonds</a>
                              <a class="dropdown-item" href="#">Kiwi</a>
                            </div>
                          </div>

                          <div className="row">
                          <input type="checkbox" id="myCheck" onChange={this.handleChange} /> Acreage
                          </div>
                          <div>
                            <div className="row">
                              Min: <input type="Text" id="num2" /> 
                            </div>
                            <div className="row">
                              Max: <input type="Text" id="num3" />
                            </div>
                          </div>
                          
                        </form>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card">
                    <h5 className="card-header">Features</h5>
                    <div className="card-body">
                      <div className="card-text">
                        <form>
                          {this.createFeatureRadioButtons()}
                        </form>
                      </div>
                        
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
    );
    
  }
}

export default Home;