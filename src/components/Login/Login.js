import React from 'react';
import { AuthUserContext } from '../Session';
import SignOutButton from './SignOutButton';
import SignInGoogle from './SignInGoogle';

const Login = () => (
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
export default Login;