import React, { Component } from 'react';
import { compose } from 'recompose';
import GoogleButton from 'react-google-button'
import { withFirebase } from '../Firebase';
import "../../css/SignInGoogle.css";

const ERROR_CODE_ACCOUNT_EXISTS =
    'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                this.props.firebase
                    .user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.user.displayName,
                        email: socialAuthUser.user.email,
                        roles: [],
                    })
                    .then(() => {
                        this.setState({ error: null });
                    })
                    .catch(error => {
                        this.setState({ error });
                    });
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({ error });
            });

        event.preventDefault();
    };

    render() {

        return (
            <GoogleButton
                className="signin-button"
                label="Login"
                type="light"
                onClick={(event) => { this.onSubmit(event) }}
            />
        );
    }
}

const SignInGoogle = compose(
    withFirebase,
)(SignInGoogleBase);

export default SignInGoogle;