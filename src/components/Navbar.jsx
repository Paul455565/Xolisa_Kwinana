import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">Xolisa Kwinana</div>
      <ul className="navbar-links">
        <li>
          <NavLink exact="true" to="/" className={({isActive}) => isActive ? "active-link" : ""}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({isActive}) => isActive ? "active-link" : ""}>
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink to="/bookings" className={({isActive}) => isActive ? "active-link" : ""}>
            Bookings
          </NavLink>
        </li>
      </ul>
      <button className="login-button" onClick={() => navigate('/signup-login')}>
        Login
      </button>
    </nav>
  );
};

export default Navbar;
