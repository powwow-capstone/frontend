import React from 'react';
import { Component } from 'react';
import Analysis from '../../components/Report/Analysis'
import SimpleMap from '../../components/Map/SimpleMap'
import imageLogo from '../../images/imageLogo.png';
import axios from "axios";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      features: [],
      categories: {}
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/api/fields")
      .then(res => this.setState({ data: res.data }))
      .catch(err => console.log(err));
  };

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
            </div>
            
          </div>
        </div>
    );
    
  }
}

export default Home;