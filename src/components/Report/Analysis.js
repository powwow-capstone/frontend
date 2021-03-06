import React from 'react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from './MyDocument';

const Analysis = () =>  {
      return (
        <div className="card">
          <h5 className="card-header">Filter options</h5>
          <div className="card-body">
            <p className="card-text">Filter options goes here!</p>
            <PDFDownloadLink 
              document={<MyDocument data={'analysis text goes here'}/>}
              fileName="efficiencyAnalysis.pdf"
              className="btn btn-primary"
            >
              Download PDF
            </PDFDownloadLink>
          </div>
        </div>
      );
  }
export default Analysis;