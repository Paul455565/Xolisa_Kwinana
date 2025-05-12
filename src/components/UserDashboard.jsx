import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import UserDashboardLayout from "./UserDashboardLayout";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [quantities, setQuantities] = useState({});
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUsername(data.name || user.displayName || "User");
        } else {
          setUsername(user.displayName || "User");
        }
      }
    };
    fetchUserName();
  }, [user]);

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
      navigate("/signup-login");
      return;
    }

    const typeDetails = ticket.ticketTypes.find(t => t.type === selectedType);
    const totalCost = typeDetails ? typeDetails.price * quantity : 0;

    localStorage.setItem("scanToPayData", JSON.stringify({
      ticketId: ticket.id,
      title: ticket.title,
      selectedType,
      quantity,
      totalCost,
      contact: user.email,
      userId: user.uid
    }));

    navigate("/scan-to-pay");
  };

  return (
    <UserDashboardLayout username={username} onLogout={() => auth.signOut().then(() => navigate("/"))}>
      <h1>User Dashboard</h1>
      <p>Welcome, {username}</p>
      <p>Here you can purchase tickets and access other pages.</p>
      <div className="tickets-list">
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
            <input
              type="number"
              min="1"
              value={quantities[ticket.id] || 1}
              onChange={e => {
                const val = e.target.value;
                if (val >= 1) {
                  setQuantities({ ...quantities, [ticket.id]: val });
                }
              }}
              style={{ width: "60px", marginLeft: "10px" }}
            />
            <button className="book-button" onClick={() => handleBookNow(ticket)}>
              Book Now
            </button>
          </div>
        ))}
      </div>
    </UserDashboardLayout>
  );
};

export default UserDashboard;
