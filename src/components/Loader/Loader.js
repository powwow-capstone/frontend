import React, { Component } from 'react';
import { css } from "@emotion/core";
import DotLoader from "react-spinners/DotLoader";
import "../../css/Loader.css"

class Loader extends React.Component {
    constructor(props) {
      super(props);
    }
   
    render() {
      return (
        <div className="sweet-loading spinner-con">
          <DotLoader
            size={150}
            css={css}
            color={"#36D7B7"}
            loading={this.props.loading}
          />
          {this.props.loading && <h4 className="text"> Go take a nap and <br/> then come back </h4>}
        </div>
      );
    }
  }

export default Loader;