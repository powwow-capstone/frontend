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
      data: [
        {
          id: 1,
          features: [
            {
              name: "efficiency", value: 0
            },
            {
              name: "water depth", value: 17
            },
            {
              name: "acreage", value: 3000
            }

          ],
          categories: [
            {
              category_name: "crop", value: "almonds"
            },
            {
              category_name: "crop type", value: "nuts"
            }
          ],
          centroid: [
            34,
            -119.5
          ],
          coordinates: {
            coordinates: [
              {
                "lng": -119.575927734375, "lat": 34.4122238159181
              },
              {
                "lng": -119.607498168945, "lat": 34.4196891784669
              },
              {
                "lng": -119.71142578125, "lat": 34.3953247070312
              },
              {
                "lng": -120.194259643555, "lat": 34.4703941345215
              },
              {
                "lng": -120.626663208008, "lat": 34.5563888549805
              },
              {
                "lng": -120.627197265625, "lat": 34.7391662597657
              },
              {
                "lng": -120.532302856445, "lat": 34.9839515686036
              },
              {
                "lng": -119.671508789062, "lat": 34.0188903808594
              },
              {
                "lng": -119.713531494141, "lat": 33.9627227783203
              },
              {
                "lng": -119.834724426269, "lat": 34.0636100769044
              },
              {
                "lng": -120.334594726562, "lat": 34.0597229003907
              },
              {
                "lng": -120.112319946289, "lat": 33.894515991211
              },
              {
                "lng": -120.116111755371, "lat": 34.0216674804688
              },
              {
                "lng": -119.044441223145, "lat": 33.4661102294922
              }
            ]
          }
        }
      ],

      features: [],
      categories: {}
    };
  }

  componentDidMount() {
    // this.loadData();

    this.getAllUniqueFeatures();


  };

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