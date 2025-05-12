import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import UserDashboardLayout from "./UserDashboardLayout";
import "./Bookings.css";
import artistImage from "./xolisa.jpg";

const UserBookings = () => {
  const [formData, setFormData] = useState({
    eventPurpose: "",
    date: "",
    time: "",
    duration: "",
  });

  const [userContact, setUserContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [status, setStatus] = useState({ success: null, message: "" });

  useEffect(() => {
    const fetchUserContact = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserContact({
            name: data.name || user.displayName || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
          });
        } else {
          setUserContact({
            name: user.displayName || "",
            email: user.email || "",
            phone: "",
          });
        }
      }
    };
    fetchUserContact();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { eventPurpose, date, time, duration } = formData;
    if (
      !eventPurpose.trim() ||
      !date ||
      !time ||
      !duration.trim()
    ) {
      setStatus({ success: false, message: "Please fill in all fields." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: null, message: "" });

    if (!validateForm()) {
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        eventPurpose: formData.eventPurpose,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        name: userContact.name,
        email: userContact.email,
        phone: userContact.phone,
        createdAt: serverTimestamp(),
      });
      setStatus({ success: true, message: "Booking request sent successfully!" });
      setFormData({
        eventPurpose: "",
        date: "",
        time: "",
        duration: "",
      });
    } catch (error) {
      setStatus({ success: false, message: "Failed to send booking request. Please try again." });
      console.error("Error adding booking: ", error);
    }
  };

  return (
    <UserDashboardLayout username={userContact.name || "User"} onLogout={() => auth.signOut().then(() => window.location.href = "/")}>
      <div className="booking-page">
        <div className="booking-left">
          <img src={artistImage} alt="Artist Xolisa Kwinana" className="artist-image" />
          <div className="artist-description">
            <h2>Why Book Xolisa Kwinana?</h2>
            <p>
              Xolisa Kwinana is a talented and versatile artist known for captivating performances and a unique style that resonates with audiences. Booking Xolisa guarantees an unforgettable experience for your event, whether it's a corporate function, private party, or festival. With professionalism and passion, Xolisa brings energy and soul to every stage.
            </p>
          </div>
        </div>
        <div className="booking-right">
          <h1>User Bookings</h1>
          <p>Make bookings for the artist upon available dates and request a quote.</p>
          <form className="booking-form" onSubmit={handleSubmit}>
            <label>
              Event Purpose:
              <input
                type="text"
                name="eventPurpose"
                value={formData.eventPurpose}
                onChange={handleChange}
                placeholder="What is the event for?"
                required
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Duration (hours):
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="For how long?"
                required
              />
            </label>
            <button type="submit" className="submit-btn-small">Send Booking Request</button>
          </form>
          {status.message && (
            <p className={status.success ? "success-message" : "error-message"}>
              {status.message}
            </p>
          )}
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default UserBookings;
