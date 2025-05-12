import React from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import "./UserDashboard.css";

const UserDashboardLayout = ({ username, onLogout, children }) => {
  const navigate = useNavigate();

  return (
    <>
      <UserNavbar username={username} onLogout={onLogout} />
      <div className="dashboard-container">
        <div className="dashboard-main">
          <aside className="sidebar">
            <h2>Menu</h2>
            <ul className="menu-list">
              <li className="menu-item" onClick={() => navigate("/user-dashboard")}>Dashboard</li>
              <li className="menu-item" onClick={() => navigate("/user-bookings")}>User Bookings</li>
              <li className="menu-item" onClick={() => navigate("/music")}>Music</li>
            </ul>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default UserDashboardLayout;
