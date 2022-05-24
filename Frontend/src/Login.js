import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth, Amplify } from 'aws-amplify';
import './start.css';

const Login = () => {
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const { loading, error, data } = useQuery(queries.post.GET_ALL);

  useEffect(() => {
    // if (data) {
    //   console.log(data.getAll);
    // }
    if(localStorage.getItem("email") != null) {
      navigate("/home");
      return <div>Logging you in...</div>;
    }
  }, []);

  async function signIn(email, password) {
    try {
        const user = await Auth.signIn(email, password);
        localStorage.setItem("email", email);
        navigate("/home");
        console.log(user);
        return user;
    } catch (error) {
        console.log('error signing in', error);
    }
  }
  return (
    <div className="main1 textini1 textini2 "><br></br>
      <section className="signup ">
        <div className="container1 ">
          <div className="signup-content ">
            <div className="signup-form" >
              <h2 className="form-title"><strong>Login</strong></h2><p></p>

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
                  Enter your password
                  <br />
                  <input
                    className="form-input textini3"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  ></input>
                </label>
              </div>
              <br />

              <button className="btn-lg btn-danger textini3" onClick={() => {signIn(email,password)}}>
                Log In
              </button>
            </div><p></p>
            <p className="loginhere">
              Don't have an account ?
              <Link
                to={`/signup`}
                className="loginhere-link"
                variant="contained"
              >
                <strong>Sign up</strong>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );

};

export default Login;
