// src/components/EnterContact.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EnterContact.css";

const EnterContact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contact, setContact] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentInfo = location.state;
    if (!paymentInfo) return navigate("/");

    // Pass full data to success page
    navigate("/payment-success", {
      state: {
        ...paymentInfo,
        contact
      }
    });
  };

  return (
    <div className="contact-form-container">
      <h2>Enter Contact Information</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter email or phone number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <button type="submit">Get My Ticket</button>
      </form>
    </div>
  );
};

export default EnterContact;
