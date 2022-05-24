import React,{ useEffect, useState} from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Auth, Amplify } from 'aws-amplify';
import './start.css';


const ConfirmSignup = () => {
  const navigate = useNavigate();
  Amplify.configure({
    Auth: {
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        //identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

        // REQUIRED - Amazon Cognito Region
        region: 'us-east-1',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-1_U3DZNzdcw',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: 'm5o1ppnqq6bfsh4osvvbmb0bf',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: 'USER_PASSWORD_AUTH',

         // OPTIONAL - Hosted UI configuration
        oauth: {
            domain: 'nyu-final-proj-front-end.auth.us-east-1.amazoncognito.com',
            scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
            redirectSignIn: 'https://nyu-final-proj-front-end.s3.amazonaws.com/index.html',
            //redirectSignIn: 'http://localhost:3000/',
            //redirectSignOut: 'http://localhost:3000/',
            responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        }
    }
  });
  async function confirmSignUp(email, code) {
    try {
        await Auth.confirmSignUp(email, code);
        localStorage.setItem("email", email);
        navigate("/home");
    } catch (error) {
        alert("The verification code is incorrect OR the email is invalid");
        console.log('error confirming sign up:', error);
    }
  }
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
    return (
        <div className="main1 textini1 textini2"><br></br>
      <section className="signup">
        <div className="container1">
          <div className="signup-content">
            <div className="signup-form" >
              <h2 className="form-title"><strong>Verify Email</strong></h2><p></p>
              <div className="form-group">
                <label>
                  Enter your email
                  <br />
                  <input
                    className="form-input textini3"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  ></input>
                </label>
              </div><p></p>
              <div className="form-group">
                <label>
                Enter your verification code which can be found in your email
                  <br />
                  <input
                    className="form-input textini3"
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                  ></input>
                </label>
              </div><p></p>

              <button className="btn-lg btn-danger textini3" onClick={() => {confirmSignUp(email,code)}}>
                Verify
              </button>
            </div><p></p>
            <p className="loginhere">
              Already have account ?
              <Link
                to={`/`}
                className="loginhere-link"
                variant="contained"
              >
                <strong>Login</strong>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
    );
};

export default ConfirmSignup;