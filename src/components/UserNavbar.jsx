import React from "react";
import "./UserNavbar.css";

const UserNavbar = ({ username, onLogout }) => {
  return (
    <nav className="user-navbar">
      <span className="welcome-message">Welcome, {username}</span>
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </nav>
  );
};

export default UserNavbar;
