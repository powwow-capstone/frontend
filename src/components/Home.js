import React from 'react';
import Analysis from './Analysis'
import SimpleMap from './SimpleMap'
import Test from './db_test'


const home = () => {
    return (
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-12">
              <SimpleMap />
            </div>
            <div className="col-md-12 mt-5">
              <Analysis />
            </div>
          <div className="col-md-12 mt-5">
            <Test />
          </div>
          </div>
        </div>
      );
    
  }

export default home;