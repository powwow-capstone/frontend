import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { compose } from 'recompose';
import GMap from '../../components/Map/GMap'
import newLogo from '../../images/newLogo.png';
import axios from "axios";
import CategorySelection from '../../components/Filtering/CategorySelection';
import FeatureSelection from '../../components/Filtering/FeatureSelection';
import TimeRangeSelection from '../../components/Filtering/TimeRangeSelection'
import "../../css/Home.css";
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';

import Navigation from '../Navigation';
import SearchList from '../Searches/SearchList';

const root_path = process.env.REACT_APP_ROOT_PATH;

class HomePage extends Component {
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
    this.saveFilters = this.saveFilters.bind(this);
    this.loadLatestSearch = this.loadLatestSearch.bind(this);

	  this.selected_feature_temp = null;
    this.selected_categories = {};
    this.selected_time_range = { start_year: 2014, start_month : null, end_year : 2014, end_month : null };  // Default initial view

  }
	
  componentDidMount() {
    this.props.firebase.users().on('value', snapshot => {
      this.setState({
        users: snapshot.val(),
      });
    });
    this.loadData(this.state.time_range);
  };

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

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
        this.setState({ displayed_data: res.data, selected_feature : this.selected_feature_temp, loading: false, selected_time_range : this.selected_time_range }); 
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
    if (value !== "NULL" && value !== "null")
    {
      this.selected_categories[category] = value;
      console.log("category: " + category + " value: " + value);
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
              if (value < this.selected_categories[category_name]["MIN"]) {
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

  saveFilters(event, authUser)  {
    // for (var i = 0; i < this.state.data.length; ++i)
    // {
    var min_acreage = "null"; 
    var max_acreage = "null";
    if (typeof this.selected_categories["Acreage"] !== 'undefined') {
      if (typeof this.selected_categories["Acreage"]["MIN"] !== 'undefined') {
        min_acreage = this.selected_categories["Acreage"]["MIN"];
      }
      if (typeof this.selected_categories["Acreage"]["MAX"] !== 'undefined') {
        max_acreage = this.selected_categories["Acreage"]["MAX"];
      }
    }
    this.props.firebase.searches().push({
      start_month: this.selected_time_range.start_month ? this.selected_time_range.start_month : "null",
      start_year: this.selected_time_range.start_year ? this.selected_time_range.start_year : "null",
      end_month: this.selected_time_range.end_month ? this.selected_time_range.end_month : "null",
      end_year: this.selected_time_range.end_year ? this.selected_time_range.end_year : "null",
      feature: (typeof this.selected_feature_temp !== 'undefined' ) ? this.selected_feature_temp : "ETa",
      acreage_min: min_acreage,
      acreage_max: max_acreage,
      crop_type: (typeof this.selected_categories["Crop"] !== 'undefined' ) ? this.selected_categories["Crop"] : "null",
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      displayed_data: this.state.displayed_data ? this.state.displayed_data : [],
      selected_feature: this.state.selected_feature ? this.state.selected_feature : "ETa",
      color_cohorts: this.state.color_cohorts ? this.state.color_cohorts : false,
    });

    event.preventDefault();
  }

  loadLatestSearch = (event, authUser) => {
    this.props.firebase
      .searches()
      .orderByChild('userId')
      .limitToLast(1)
      .equalTo(authUser.uid)
      .on('value', snapshot => {
        const searchObject = snapshot.val();

        if (searchObject) {
          const searchList = Object.keys(searchObject).map(key => ({
            ...searchObject[key],
            uid: key,
          }));
          console.log("Searchlist:");
          console.log(searchList);
          if (searchList[0].start_month === "null") {
            this.selected_time_range.start_month = null;
            this.selected_time_range.end_month = null;
          } 
          else {
            this.selected_time_range.start_month = parseInt(searchList[0].start_month, 10);
            this.selected_time_range.end_month = parseInt(searchList[0].end_month, 10);
          }
          this.selected_time_range.start_year = parseInt(searchList[0].start_year, 10);
          this.selected_time_range.end_year = parseInt(searchList[0].end_year, 10);
          this.selected_feature_temp = searchList[0].feature;
          this.selected_categories = {}
          if (searchList[0].acreage_min !== "null") {
            if (!("Acreage" in this.selected_categories)) {
              this.selected_categories["Acreage"] = {};
            }
            this.selected_categories["Acreage"]["MIN"] = searchList[0].acreage_min;
          }

          if (searchList[0].acreage_max !== "null") {
            if (!("Acreage" in this.selected_categories)) {
              this.selected_categories["Acreage"] = {};
            }
            this.selected_categories["Acreage"]["MAX"] = searchList[0].acreage_max;
          }
          if (searchList[0].crop_type !== "null") {
            this.handleCategoryDropdownSelection("Crop", searchList[0].crop_type);
          }
          this.setState({displayed_data : searchList[0].displayed_data, selected_feature : searchList[0].selected_feature, color_cohorts : searchList[0].color_cohorts});
        }
        else {
          alert("Load failed. No searches found.");
        }
      }
    );
    console.log("Selected time range:");
    console.log(this.selected_time_range);
  }


  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div className="row" style={{ width: `100vw` }}>
            {this.state && this.state.data && (this.state.data instanceof Array) &&
            <div className="col-lg-9 col-md-8">
            <GMap data={this.state.displayed_data} colorCohorts={this.state.color_cohorts} selectedFeature={this.state.selected_feature} dateRange={JSON.parse(JSON.stringify(this.selected_time_range))} loading={this.state.loading} />
            </div>}
            {this.state && this.state.data && (this.state.data instanceof Array) &&
            <div className="col-lg-3 col-md-4">
              <div className="mb-2 img-row">
                <img className="img-column" src={newLogo} alt="Logo"/>
                <Navigation/>
                
                <div className="container row">
                  <TimeRangeSelection currentDate={JSON.parse(JSON.stringify(this.selected_time_range))} handleTimeRangeSelection={this.handleTimeRangeSelection}/>
                </div>
                <div className="container row">
                  <CategorySelection data={this.state.data} defaultCategories={JSON.parse(JSON.stringify(this.selected_categories))} handleSelection={this.handleCategoryDropdownSelection} handleInput={this.handleCategoryMinMaxInput} handleDeselect={this.handleCheckboxDeselect}/>
                </div>
                <div className="container row">
                  <FeatureSelection data={this.state.data} selectedFeature={this.state.selected_feature} handleSelection={this.handleFeatureSelection} />
                </div>
                <div className="apply-button-container">
                  <Button className="center" variant="outline-primary" def onClick={() => this.submitFilters()}>Apply Changes</Button>
                </div>
                <div className="apply-button-container">
                  <Button className="center" disabled={!authUser} variant="outline-primary" def onClick={(event) => this.saveFilters(event, authUser)}>Save Selections</Button>
                </div>
                <div className="apply-button-container">
                  <Button className="center" disabled={!authUser} variant="outline-primary" def onClick={(event) => this.loadLatestSearch(event, authUser)}>Load Selections</Button>
                </div>
              </div>
            </div>}
          </div>
        )}
        </AuthUserContext.Consumer>
    );
    
  }
}

export default compose(
  withFirebase,
)(HomePage);