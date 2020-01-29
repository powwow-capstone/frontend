import React from 'react';
import { Component } from 'react';
import { Button } from 'reactstrap';
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

      data: null,            // This contains all data from the server
      displayed_data: [], // This contains a subset of data that will be displayed on the map
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
      .get("http://localhost:5000/api/fields")
      .then(res => this.setState({ data: res.data, displayed_data: res.data }))
      .catch (err => console.log(err));
  }

  handleCategoryDropdownSelection(category, value) {
    // var selected_categories_cpy = JSON.parse(JSON.stringify(this.state.selected_categories));
    if (value != "NULL")
    {
      this.selected_categories[category] = value;

      // selected_categories_cpy[category] = value;
      // this.setState({ selected_categories: selected_categories_cpy });
    }
    else
    {
      this.handleCheckboxDeselect(category);
    }
  }

  handleCategoryMinMaxInput(category, min_max, value) {
    // min_max will equal either "MIN" or "MAX"
    // var selected_categories_cpy = JSON.parse(JSON.stringify(this.state.selected_categories));
    // if (!(category in selected_categories_cpy))
    // {
    //   selected_categories_cpy[category] = {};
    // }
    // selected_categories_cpy[category][min_max] = value;
    // this.setState({ selected_categories: selected_categories_cpy });
    if (!(category in this.selected_categories))
    {
      this.selected_categories[category] = {}
    }
    this.selected_category[category][min_max] = value;
  }

  handleCheckboxDeselect(category) {
    delete this.selected_categories[category];
    // var selected_categories_cpy = JSON.parse(JSON.stringify(this.state.selected_categories));
    // delete selected_categories_cpy[category];
    // this.setState({ selected_categories: selected_categories_cpy });
  }

  handleRadioButtonSelection(feature) {
    this.selected_feature_temp = feature;
    // this.setState( {selected_feature_temp : feature} )
  }

  submitFilters() {
    console.log("SUBMIT");
    console.log(this.selected_categories);
    console.log(this.selected_feature_temp);
    // Retrieve all the selected categories


    // Retrieve the selected feature
    var new_displayed_data = []
    const all_data = JSON.parse(JSON.stringify(this.state.data));

    for (var i = 0; i < all_data.length; ++i)
    {
      var include_datapoint = true;
      const categories = all_data[i].categories;
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
        // console.log("Include datapoint: ");
        // console.log(all_data[i]);
        new_displayed_data.push(all_data[i]);
      }
      
    }

    

    this.setState({ displayed_data: new_displayed_data });
    this.setState({ selected_feature : this.selected_feature_temp }); // I'm pretty sure this isn't the best way to do this

  }

  render() {
    // console.log("Render home");
    // console.log(this.state.data);
    return (
        <div className="mt-5">
          <div className="row">

            <div className="col-md-9">
              <SimpleMap data={this.state.displayed_data} selectedFeature={this.state.selected_feature}/>
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
  =               <CategoryFiltering data={this.state.data} handleSelection={this.handleCategoryDropdownSelection} handleInput={this.handleCategoryMinMaxInput} handleDeselect={this.handleCheckboxDeselect}/>
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