import React from 'react';
import { AuthUserContext } from '../Session';
import SignOutButton from './SignOutButton';
import SignInGoogle from './SignInGoogle';

const Login = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <LoginAuth authUser={authUser} />
      ) : (
        <LoginNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);
const LoginAuth = ({ authUser }) => (
  <SignOutButton />
);
const LoginNonAuth = () => (
  <SignInGoogle />
);
export default Login;