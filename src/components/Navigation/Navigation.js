import React from 'react';
import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import SignInGoogle from '../SignIn/SignInGoogle';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);
const NavigationAuth = ({ authUser }) => (
  <SignOutButton />
);
const NavigationNonAuth = () => (
  <SignInGoogle />
);
export default Navigation;