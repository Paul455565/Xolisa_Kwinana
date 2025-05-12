import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import Home from './components/Home'; // Make sure your file is saved as Home.jsx
import Contact from './components/Contact';
import Events from './components/Events';
import Bookings from './components/Bookings';
import Recordings from './components/Recordings';
import SignUpLogin from './components/SignUpLogin';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import PaymentSuccess from './components/PaymentSuccess';
import EnterContact from './components/EnterContact';
import ScanToPayPage from './components/ScanToPayPage';
import UserBookings from './components/UserBookings';
import UserMusic from './components/UserMusic';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/recordings" element={<Recordings />} />
        <Route path="/signup-login" element={<SignUpLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/payment" element={<PaymentSuccess />} />   
        <Route path="/enter-contact" element={<EnterContact />} />
        <Route path="/scan-to-pay" element={<ScanToPayPage />} />
        <Route path="/user-bookings" element={<UserBookings />} />
        <Route path="/music" element={<UserMusic />} />
      </Routes>
    </Router>
  );
};

export default App;
