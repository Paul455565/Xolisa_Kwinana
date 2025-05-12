import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUpLogin.css";
import Navbar from "./Navbar";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const SignUpLogin = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [signUpData, setSignUpData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    cellphone: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password);
      const user = userCredential.user;
      // Store additional user info in Firestore with default role "follower"
      await setDoc(doc(db, "users", user.uid), {
        name: signUpData.name,
        surname: signUpData.surname,
        email: signUpData.email,
        cellphone: signUpData.cellphone,
        role: "follower"
      });
      console.log("User document written!");
      alert("Sign up successful!");
      navigate("/user-dashboard");
    } catch (error) {
      alert("Error signing up: " + error.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        // If no user document, default to user dashboard
        navigate("/user-dashboard");
      }
      alert("Login successful!");
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-login-container">
        <video autoPlay loop muted className="background-video">
          <source src="https://youtu.be/yPrZjT5hlXk" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="toggle-buttons">
          <button
            className={isSignUp ? "active" : ""}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
          <button
            className={!isSignUp ? "active" : ""}
            onClick={() => setIsSignUp(false)}
          >
            Login
          </button>
        </div>

      {isSignUp ? (
        <form className="signup-form" onSubmit={handleSignUpSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={signUpData.name}
            onChange={handleSignUpChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={signUpData.surname}
            onChange={handleSignUpChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signUpData.email}
            onChange={handleSignUpChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signUpData.password}
            onChange={handleSignUpChange}
            required
          />
          <input
            type="tel"
            name="cellphone"
            placeholder="Cellphone Number"
            value={signUpData.cellphone}
            onChange={handleSignUpChange}
            required
          />
          <button type="submit" className="home-button">
            Sign Up
          </button>
        </form>
      ) : (
        <>
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <button type="submit" className="home-button">
              Login
            </button>
          </form>
          <div className="reset-password-link">
            <Link to="/reset-password">Forgot Password? Reset here</Link>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default SignUpLogin;
