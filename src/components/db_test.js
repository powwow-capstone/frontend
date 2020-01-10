import React, { Component } from "react";
import axios from "axios";
import './db_test.css'

// This is taken from this database: https://scotch.io/tutorials/build-a-to-do-application-using-django-and-react
// This code won't actually be used. It's just for an example for how to interact with the backend

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherdataList: []
        };
    }
    componentDidMount() {
        this.refreshList();
    }
    refreshList = () => {
        axios
            .get("http://localhost:5000/weather")
            .then(res => this.setState({ weatherdataList: res.data }))
            .catch(err => console.log(err));
    };

    renderItems = () => {

        return Array.from(this.state.weatherdataList).map(item => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
                item.data
            </li>
        ));
    };


    render() {
        return (
            <main className="content">
                                
                <div className="row ">
                    
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <p className="text-center">This part and all below will not be in the final product. This is just to test that the app can interact with the backend</p> 

                            <ul className="list-group list-group-flush">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
                
            </main>
        );
    }
}
export default Test;