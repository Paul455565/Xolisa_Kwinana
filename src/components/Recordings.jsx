import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Recordings.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Recordings = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsSnapshot = await getDocs(collection(db, "tickets"));
        const ticketsList = ticketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTickets(ticketsList);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  const handleTypeChange = (ticketId, type) => {
    setSelectedTypes(prev => ({ ...prev, [ticketId]: type }));
  };

  const handleQuantityChange = (ticketId, quantity) => {
    setQuantities(prev => ({ ...prev, [ticketId]: quantity }));
  };

  const handleBookNow = (ticket) => {
    const selectedType = selectedTypes[ticket.id];
    const quantity = quantities[ticket.id] || 1;
    if (!selectedType) {
      alert("Please select a ticket type.");
      return;
    }
    alert(`Booking ${quantity} ${selectedType} ticket(s) for ${ticket.title} at price TBD.`);
    // Implement transaction functionality here
  };

  return (
    <>
      <Navbar />
      <div className="recordings-page">
        <div className="recordings-container">
          <h1 className="recordings-title">Upcoming Events & Recordings</h1>
          <p>See upcoming live recordings and events. Buy tickets to experience the power of gospel music.</p>

          <div className="recordings-list">
            {tickets.length === 0 ? (
              <p>No tickets available.</p>
            ) : (
              tickets.map(ticket => (
                <div className="recording-card" key={ticket.id}>
                  <h3>{ticket.title}</h3>
                  <p><strong>Date:</strong> {ticket.date} <strong>Time:</strong> {ticket.time}</p>
                  <p><strong>Location:</strong> {ticket.location}</p>
                  <div>
                    <label>
                      Ticket Type:
                      <select
                        value={selectedTypes[ticket.id] || ""}
                        onChange={e => handleTypeChange(ticket.id, e.target.value)}
                      >
                        <option value="">Select type</option>
                        {ticket.ticketTypes && ticket.ticketTypes.map((typeObj, index) => (
                          <option key={index} value={typeObj.type}>
                            {typeObj.type} - R{typeObj.price}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Quantity:
                      <input
                        type="number"
                        min="1"
                        value={quantities[ticket.id] || 1}
                        onChange={e => handleQuantityChange(ticket.id, e.target.value)}
                      />
                    </label>
                  </div>
                  <button className="book-button" onClick={() => handleBookNow(ticket)}>Book Now</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Recordings;
