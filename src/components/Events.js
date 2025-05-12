import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Events.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; 

const Events = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({}); 
  const [quantities, setQuantities] = useState({});         
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchTickets = async () => {
      const ticketsSnapshot = await getDocs(collection(db, "tickets"));
      const ticketsList = ticketsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketsList);
    };
    fetchTickets();
  }, []);

  const handleBookNow = (ticket) => {
    const selectedType = selectedTypes[ticket.id];
    const quantity = parseInt(quantities[ticket.id] || 1, 10);
  
    if (!selectedType) {
      alert("Please select a ticket type.");
      return;
    }
  
    if (!user) {
      alert("You need to log in first.");
      navigate("/signup-login"); // redirect to login page
      return;
    }
  
    const typeDetails = ticket.ticketTypes.find(t => t.type === selectedType);
    const totalCost = typeDetails ? typeDetails.price * quantity : 0;
  
    // Store data in localStorage and go to scan page
    localStorage.setItem("scanToPayData", JSON.stringify({
      ticketId: ticket.id,
      title: ticket.title,
      selectedType,
      quantity,
      totalCost,
      contact: user.email, // use Firebase Auth info
      userId: user.uid
    }));
  
    navigate("/scan-to-pay");
  };

  return (
    <>
      <Navbar />
      <div className="events-page">
        <h1 className="events-title">Upcoming Events & Recordings</h1>
        {tickets.length === 0 ? <p>No tickets available.</p> : tickets.map(ticket => (
          <div className="event-card" key={ticket.id}>
            <h3>{ticket.title}</h3>
            <p><strong>Date:</strong> {ticket.date} <strong>Time:</strong> {ticket.time}</p>
            <p><strong>Location:</strong> {ticket.location}</p>
            <label>
              Ticket Type:
              <select
                value={selectedTypes[ticket.id] || ""}
                onChange={e => {
                  setSelectedTypes({ ...selectedTypes, [ticket.id]: e.target.value });
                }}
              >
                <option value="">Select type</option>
                {ticket.ticketTypes?.map((typeObj, index) => (
                  <option key={index} value={typeObj.type}>
                    {typeObj.type} - R{typeObj.price}
                  </option>
                ))}
              </select>
            </label>
            <button className="book-button" onClick={() => handleBookNow(ticket)}>
              Book Now
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Events;
