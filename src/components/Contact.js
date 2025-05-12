import React, { useState } from "react";
import Navbar from "./Navbar";
import emailjs from "emailjs-com";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./Contact.css";
import "./ContactLayout.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Store contact form data in Firestore
      await addDoc(collection(db, "contacts"), {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: serverTimestamp(),
      });

      // Send email using emailjs
      await emailjs.send(
        "your_service_id",
        "your_template_id",
        {
          from_name: form.name,
          reply_to: form.email,
          message: form.message,
        },
        "your_user_id"
      );

      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-page">
        <div className="contact-container">
          <h2>Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Our Contact Information</h3>
              <p><strong>Email:</strong> bookings@xolisakwinana.com</p>
              <p><strong>Address:</strong> 1234 Cape IT Initiative Street, Cape Town, South Africa</p>
              <p><strong>Phone:</strong> 0710730431 / 0783463347</p>
              <div className="social-media">
                <h4>Follow Us</h4>
                <ul>
                  <li><a href="https://www.facebook.com/XKwinana" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i> Facebook</a></li>
                  <li><a href="https://twitter.com/xvkwinana" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i> Twitter</a></li>
                  <li><a href="https://www.instagram.com/xolisakwinana/?hl=en" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i> Instagram</a></li>
                  <li><a href="https://www.tiktok.com/@xolisa_kwinana" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i> TikTok</a></li>
                  <li><a href="http://www.youtube.com/@xolisakwinana1974" target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i> YouTube</a></li>
                </ul>
              </div>
            </div>
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>

                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
