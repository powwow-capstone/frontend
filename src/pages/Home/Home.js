import React from 'react';
import { Component } from 'react';
import { Button } from 'reactstrap';
import GMap from '../../components/Map/GMap'
import imageLogo from '../../images/imageLogo.png';
import axios from "axios";
import CategoryFiltering from '../../components/Filtering/CategoryFiltering';
import FeatureSelection from '../../components/Filtering/FeatureSelection';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,            // This contains all data from the server
      displayed_data: null,
      selected_feature: null
    };
    this.handleCategoryDropdownSelection = this.handleCategoryDropdownSelection.bind(this);
    this.handleCategoryMinMaxInput = this.handleCategoryMinMaxInput.bind(this);
    this.handleCheckboxDeselect = this.handleCheckboxDeselect.bind(this);
    this.submitFilters = this.submitFilters.bind(this);
    this.handleRadioButtonSelection = this.handleRadioButtonSelection.bind(this);
    this.selected_feature_temp = null;
    this.selected_categories = {}

  }

  componentDidMount() {
    this.loadData();

  };


  loadData() {
    axios
      .get("https://space-monitor-backend-staging.herokuapp.com/api/fields")
      .then(res => this.setState({ data: res.data, displayed_data : res.data }))
      .catch (err => console.log(err));
  }

  requeryData(displayed_data) {
    axios.post("https://space-monitor-backend-staging.herokuapp.com/api/filter_fields", displayed_data)
      .then(res => this.setState({ displayed_data: res.data }))
      .catch(err => console.log(err));

  }

  handleCategoryDropdownSelection(category, value) {
    if (value != "NULL")
    {
      this.selected_categories[category] = value;
    }
    else
    {
      this.handleCheckboxDeselect(category);
    }
  }

  handleCategoryMinMaxInput(category, min_max, value) {
    // min_max will equal either "MIN" or "MAX"

    if (!(category in this.selected_categories))
    {
      this.selected_categories[category] = {}
    }
    this.selected_categories[category][min_max] = value;
  }

  handleCheckboxDeselect(category) {
    delete this.selected_categories[category];
  }

  handleRadioButtonSelection(feature) {
    this.selected_feature_temp = feature;
  }

  submitFilters() {
    // Retrieve all the selected categories
    // Retrieve the selected feature
    var new_displayed_data = []
    // const all_data = JSON.parse(JSON.stringify(this.state.data));

    for (var i = 0; i < this.state.data.length; ++i)
    {
      var include_datapoint = true;
      const categories = this.state.data[i].categories;
      const id = this.state.data[i].id;
      for (var j = 0; j < categories.length; ++j)
      {
        const category_name = categories[j].category_name;
        const type = categories[j].type;
        const value = categories[j].value;

        if (category_name in this.selected_categories)
        {
          if (type == "string")
          {
            if (value != this.selected_categories[category_name])
            {
              include_datapoint = false;
            }
          }
          else
          {
            if ("MIN" in this.selected_categories[category_name])
            {
              if (value < this.selected_categories[category_name]["MIN"])
              {
                include_datapoint = false;
              }
            }
            if ("MAX" in this.selected_categories[category_name])
            {
              if (value > this.selected_categories[category_name]["MAX"]) {
                include_datapoint = false;
              }
            }
          }
        }
      }
      if (include_datapoint)
      {
        new_displayed_data.push(id);
      }
      
    }

    this.setState({ selected_feature : this.selected_feature_temp }); 
    this.requeryData(new_displayed_data);

  }

  render() {
    console.log(this.state.data);
    return (
        <div className="mt-5">
          <div className="row">

            <div className="col-md-9">
            {this.state && this.state.data && <GMap data={this.state.displayed_data} selectedFeature={this.state.selected_feature} /> }
            </div>
            <div className="col-md-3">
              <div className="col-12">
                  <img src={imageLogo} alt="Logo" className="fixed_img center" />
              </div>
              {this.state && this.state.data && <div>
                <div className="container row">
                  <FeatureSelection data={this.state.data} handleSelection={this.handleRadioButtonSelection} />
                </div>
                <div className="container row">
                  <CategoryFiltering data={this.state.data} handleSelection={this.handleCategoryDropdownSelection} handleInput={this.handleCategoryMinMaxInput} handleDeselect={this.handleCheckboxDeselect}/>
                </div>
                <div className="container row">
                  <Button className="center" variant="outline-primary" onClick={() => this.submitFilters()}>Apply Changes</Button>
                </div>
              </div>}
            </div>
          </div>
        </div>
    );
    
  }
}

export default Home;