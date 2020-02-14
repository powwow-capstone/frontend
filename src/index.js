import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const apiKey = process.env.REACT_APP_FIREBASE_KEY;
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const senderId = process.env.REACT_APP_FIREBASE_SENDER_ID;
const appId = process.env.REACT_APP_FIREBASE_APP_ID;
const measurementId = process.env.REACT_APP_MEASUREMENT_ID;

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
window.$firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
    apiKey: apiKey,
    authDomain: "" + projectId + ".firebaseapp.com",
    databaseURL: "https://" + projectId + ".firebaseio.com",
    projectId: projectId,
    storageBucket: "" + projectId + ".appspot.com",
    messagingSenderId: senderId,
    appId: appId,
    measurementId: "G-" + measurementId,
};

// Initialize Firebase as a global variable
window.$firebase.initializeApp(firebaseConfig);

var firebaseui = require('firebaseui');
window.$ui = new firebaseui.auth.AuthUI(window.$firebase.auth());

ReactDOM.render(<App />, document.getElementById('root'));

