import React from 'react';
// The FirebaseContext.Provider component is used to provide a Firebase instance
//  once at the top-level of your React component tree
const FirebaseContext = React.createContext(null);
export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
      {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  );
export default FirebaseContext;