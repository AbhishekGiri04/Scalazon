import { React, useState } from "react";
import "./signin.css";
// Using custom MoodMart branding
import BG1 from "../imgs/login-BG.png";
import BG2 from "../imgs/login-BG2.png";
import google from "../imgs/google.png";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../Firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import swal from "sweetalert";



function Signin({ onLogin = null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigate = useNavigate();

  document.title = "MoodMart - Feel. Find. Shop."

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailBlur = (event) => {
    if (
      event.target.value === "" ||
      !event.target.value.includes("@") ||
      !event.target.value.includes(".com")
    ) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = (event) => {
    if (event.target.value === "") {
      setPasswordError("Please enter your password.");
    } else if (event.target.value.length < 4) {
      setPasswordError("Password is too small.");
    } else {
      setPasswordError("");
    }
  };

  const LogInUser = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (onLogin) {
          onLogin({ name: user.displayName || user.email.split('@')[0], email: user.email });
        }
        navigate("/home");
      })
      .catch((error) => {
        swal({
          title: "Error!",
          text: error.message,
          icon: "error",
          buttons: "Ok",
        });
      });
  };

  const GoogleAuth = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('Google signin successful:', user);
        if (onLogin) {
          onLogin({ name: user.displayName || user.email.split('@')[0], email: user.email });
        }
        navigate("/home");
      })
      .catch((error) => {
        swal({
          title: "Error!",
          text: error.message,
          icon: "error",
          buttons: "Ok",
        });
      });
  };

  const handleBgLoad = () => {
    setBgLoaded(true);
  };

  return (
    <>
      <div className="signin-page">
        <div className="login-navbar">
          <div className="main-logo">
            <img 
              src="https://i.pinimg.com/1200x/fc/9d/ff/fc9dfff31121e22216be786dc7a2ee5f.jpg" 
              className="moodmart-logo" 
              alt="MoodMart Logo"
            />
            <span className="logo-text">MoodMart</span>
          </div>
          <div className="signup">
            <Link to="/signup">
              <button className="signup-btn">Sign up</button>
            </Link>
          </div>
        </div>
        <div className="background">
          <img src={BG1} className="BG1" onLoad={handleBgLoad} />
          <img src={BG2} className="BG2" onLoad={handleBgLoad} />
        </div>
        {bgLoaded && (
          <div className="main-form">
            <div className="login-form">
              <div className="some-text">
                <p className="user">User Login</p>
                <p className="user-desc">
                  Hey, Enter your details to get sign in to your account
                </p>
              </div>
              <div className="user-details">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  required
                />
                {emailError && (
                  <div className="error-message">{emailError}</div>
                )}
                <input
                  type="password"
                  placeholder="Passcode"
                  className="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  required
                />
                {PasswordError && (
                  <div className="error-message">{PasswordError}</div>
                )}
                <button onClick={LogInUser} className="signin-btn">
                  Sign in
                </button>
                <div className="extra-buttons">
                  <p className="or">&#x2015; Or &#x2015;</p>
                  <button onClick={GoogleAuth} className="google">
                    <p>Sign in with</p>
                    <img src={google} className="google-img" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Signin;
