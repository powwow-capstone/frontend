import React from 'react';
import { withFirebase } from '../Firebase';
import "../../css/Home.css";
import Button from '@material-ui/core/Button';
const SignOutButton = ({ firebase }) => (

  <Button className="signout-con" variant="outlined" color="primary" onClick={firebase.doSignOut}>
    Sign Out
  </Button>
);
export default withFirebase(SignOutButton);