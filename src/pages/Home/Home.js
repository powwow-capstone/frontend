import React from 'react';
import Analysis from '../../components/Report/Analysis'
import SimpleMap from '../../components/Map/SimpleMap'
import imageLogo from '../../images/imageLogo.png';


const home = () => {
    return (
        <div className="mt-5">
          <div className="row">

            <div className="col-md-9">
              <SimpleMap />
            </div>
            <div className="col-md-3">
              <div className="col-12">
                <img src={imageLogo} alt="Logo" className="fixed_img center" />
              </div>
              <div className="col-12">
                <Analysis />
              </div>
            </div>
            
          </div>
        </div>
      );
    
  }

export default home;