import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import Navbar from "./Navbar";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement reset password logic
    console.log("Reset password for:", email);
  };

  return (
    <>
      <Navbar />
      <div className="reset-password-container">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="home-button">
            Reset Password
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
