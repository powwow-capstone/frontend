import React from 'react';
import { Component } from 'react';
import { Button } from 'reactstrap';
import GMap from '../../components/Map/GMap'
import newLogo from '../../images/newLogo.png';
import axios from "axios";
import CategorySelection from '../../components/Filtering/CategorySelection';
import FeatureSelection from '../../components/Filtering/FeatureSelection';
import TimeRangeSelection from '../../components/Filtering/TimeRangeSelection'
import GoogleLogin from 'react-google-login';
import "../../css/Home.css";


const root_path = process.env.REACT_APP_ROOT_PATH;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,  	  // This contains all data from the server
	    displayed_data: null,
      selected_feature: null,
      color_cohorts : false,
      loading: false
    };
    this.handleCategoryDropdownSelection = this.handleCategoryDropdownSelection.bind(this);
    this.handleCategoryMinMaxInput = this.handleCategoryMinMaxInput.bind(this);
    this.handleCheckboxDeselect = this.handleCheckboxDeselect.bind(this);
    this.submitFilters = this.submitFilters.bind(this);
    this.handleFeatureSelection = this.handleFeatureSelection.bind(this);
    this.handleTimeRangeSelection = this.handleTimeRangeSelection.bind(this);

	  this.selected_feature_temp = null;
    this.selected_categories = {};
    this.selected_time_range = { start_year: 2014, start_month : null, end_year : 2014, end_month : null };  // Default initial view

  }
	
  componentDidMount() {
    this.loadData(this.state.time_range);
  };


  loadData() {
    axios
      .get("" + root_path + "/api/fields?start_month=" + this.selected_time_range.start_month + "&start_year=" + this.selected_time_range.start_year + "&end_month=" + this.selected_time_range.end_month + "&end_year=" + this.selected_time_range.end_year)
      .then(res => this.setState({ data: res.data, displayed_data: res.data }))
      .catch(err => {
        console.log(err);
        alert("No data matches parameters selected");
      });
  
  }

  requeryData(displayed_data) {
    const parameters = JSON.parse(JSON.stringify(this.selected_time_range));
    parameters.data = displayed_data
    axios.post("" + root_path + "/api/filter_fields", parameters)
      .then(res => {
        this.setState({ displayed_data: res.data, selected_feature : this.selected_feature_temp, loading: false }); 
      })
      .catch(err => {
        console.log(err);
        alert("No data matches parameters selected");
      });

  }

  handleTimeRangeSelection(start_month, start_year, end_month, end_year){
    this.selected_time_range.start_month = start_month;
    this.selected_time_range.start_year = start_year;
    this.selected_time_range.end_month = end_month;
    this.selected_time_range.end_year = end_year;
  }

  handleCategoryDropdownSelection(category, value) {
    if (value !== "NULL")
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

  handleFeatureSelection(feature, updateImmediately = false) {
    this.selected_feature_temp = feature;

    // If updateImmediately is set to true, then immediately call setState if this.state.selected_feature is null
    // Otherwise, the selected feature will not be updated until the user clicks "Apply Changes"
    if (updateImmediately && this.state.selected_feature === null) {
      this.setState( { selected_feature : feature } ); 
    }
  }

  submitFilters() {
    // Retrieve all the selected categories
    // Retrieve the selected feature
    this.setState({ loading: true });

    var new_displayed_data = []

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
          if (type === "string")
          {
            if (value !== this.selected_categories[category_name])
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

    this.requeryData(new_displayed_data);

  }

  render() {
    return (
      <div className="row" style={{ width: `100vw` }}>
          {this.state && this.state.data && (this.state.data instanceof Array) &&
          <div className="col-lg-9 col-md-8">
          <GMap data={this.state.displayed_data} colorCohorts={this.state.color_cohorts} selectedFeature={this.state.selected_feature} dateRange={this.selected_time_range} loading={this.state.loading} />
          </div>}
          {this.state && this.state.data && (this.state.data instanceof Array) &&
          <div className="col-lg-3 col-md-4">
            <div className="mb-2">
              <img className="img-logo" src={newLogo} alt="Logo"/>
            </div>
            <div>
              <div className="container row">
                <TimeRangeSelection currentDate={JSON.parse(JSON.stringify(this.selected_time_range))} handleTimeRangeSelection={this.handleTimeRangeSelection}/>
              </div>
              <div className="container row">
                <CategorySelection data={this.state.data}  handleSelection={this.handleCategoryDropdownSelection} handleInput={this.handleCategoryMinMaxInput} handleDeselect={this.handleCheckboxDeselect}/>
              </div>
              <div className="container row">
                <FeatureSelection data={this.state.data} handleSelection={this.handleFeatureSelection} />
              </div>
              <div className="apply-button-container">
                <Button className="center" variant="outline-primary" def onClick={() => this.submitFilters()}>Apply Changes</Button>
              </div>
            </div>
          </div>}
        </div>
    );
    
  }
}

export default Home;