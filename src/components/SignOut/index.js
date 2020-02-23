import React from 'react';
import { withFirebase } from '../Firebase';
import "../../css/Home.css";
const SignOutButton = ({ firebase }) => (

  <button type="button" className="img-column" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);
export default withFirebase(SignOutButton);