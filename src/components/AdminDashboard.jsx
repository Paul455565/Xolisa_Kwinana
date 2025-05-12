import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("bookings");
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    ticketTypes: {
      General: { price: "", quantity: "" },
      VIP: { price: "", quantity: "" },
      VVIP: { price: "", quantity: "" },
    }
  });

  // Fetch bookings from Firestore
  const fetchBookings = async () => {
    try {
      const bookingsSnapshot = await getDocs(collection(db, "bookings"));
      const bookingsList = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingsList);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Fetch contacts from Firestore
  const fetchContacts = async () => {
    try {
      const contactsSnapshot = await getDocs(collection(db, "contacts"));
      const contactsList = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContacts(contactsList);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Fetch followers from Firestore where role == "follower"
  const fetchFollowers = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "follower"));
      const followersSnapshot = await getDocs(q);
      const followersList = followersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFollowers(followersList);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  // Fetch tickets from Firestore
  const fetchTickets = async () => {
    try {
      const ticketsSnapshot = await getDocs(collection(db, "tickets"));
      const ticketsList = ticketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTickets(ticketsList);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchContacts();
    fetchFollowers();
    fetchTickets();
  }, []);

  // Handle new ticket form input change
  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  // Handle new ticket form submit
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tickets"), {
        title: newTicket.title,
        date: newTicket.date,
        time: newTicket.time,
        location: newTicket.location,
        ticketTypes: Object.entries(newTicket.ticketTypes).map(([type, data]) => ({
          type,
          price: data.price,
          quantity: data.quantity
        })),
        createdAt: serverTimestamp(),
      });
      
      setNewTicket({
        title: "",
        date: "",
        time: "",
        location: "",
        ticketTypes: {
          General: { price: "", quantity: "" },
          VIP: { price: "", quantity: "" },
          VVIP: { price: "", quantity: "" },
        }
      });
      fetchTickets(); // Refresh tickets list
      alert("Ticket created successfully!");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket.");
    }
  };

  // Render functions for each page
  const renderBookings = () => (
    <section className="section bookings-section">
      <h2>Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map(booking => (
            <li key={booking.id}>
              <strong>{booking.name || booking.email || "Booking"}</strong> - {booking.date || "No date"} - {booking.details || ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  const renderTickets = () => (
    <section className="section tickets-section">
      <h2>Create Ticket</h2>
      <form onSubmit={handleTicketSubmit} className="ticket-form">
  <input type="text" name="title" placeholder="Event Title" value={newTicket.title} onChange={e => setNewTicket({ ...newTicket, title: e.target.value })} required />
  <input type="date" name="date" value={newTicket.date} onChange={e => setNewTicket({ ...newTicket, date: e.target.value })} required />
  <input type="time" name="time" value={newTicket.time} onChange={e => setNewTicket({ ...newTicket, time: e.target.value })} required />
  <input type="text" name="location" placeholder="Location" value={newTicket.location} onChange={e => setNewTicket({ ...newTicket, location: e.target.value })} required />
  
  {["General", "VIP", "VVIP"].map((type) => (
    <div key={type} style={{ flex: "1 1 100%" }}>
      <h4>{type} Ticket</h4>
      <input
        type="text"
        placeholder={`${type} Price`}
        value={newTicket.ticketTypes[type].price}
        onChange={(e) =>
          setNewTicket((prev) => ({
            ...prev,
            ticketTypes: {
              ...prev.ticketTypes,
              [type]: {
                ...prev.ticketTypes[type],
                price: e.target.value,
              },
            },
          }))
        }
        required
      />
      <input
        type="number"
        placeholder={`${type} Quantity`}
        value={newTicket.ticketTypes[type].quantity}
        onChange={(e) =>
          setNewTicket((prev) => ({
            ...prev,
            ticketTypes: {
              ...prev.ticketTypes,
              [type]: {
                ...prev.ticketTypes[type],
                quantity: e.target.value,
              },
            },
          }))
        }
        required
      />
    </div>
  ))}

  <button type="submit">Create Ticket</button>
</form>

      <h3>Existing Tickets</h3>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id}>
              <strong>{ticket.title}</strong> - {ticket.date} - {ticket.time} - {ticket.location}
              <ul>
                {ticket.ticketTypes && ticket.ticketTypes.map((typeObj, index) => (
                  <li key={index}>
                    {typeObj.type} Tickets: Quantity: {typeObj.quantity} {typeObj.sold !== undefined ? `- Sold: ${typeObj.sold}` : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  const renderUsers = () => (
    <section className="section followers-section">
      <h2>Followers</h2>
      {followers.length === 0 ? (
        <p>No followers found.</p>
      ) : (
        <table className="followers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Cellphone</th>
            </tr>
          </thead>
          <tbody>
            {followers.map(follower => (
              <tr key={follower.id}>
                <td>{follower.name}</td>
                <td>{follower.surname}</td>
                <td>{follower.email}</td>
                <td>{follower.cellphone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );

  const renderMessages = () => (
    <section className="section contacts-section">
      <h2>Contact Messages</h2>
      {contacts.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <ul>
          {contacts.map(contact => (
            <li key={contact.id}>
              <strong>{contact.name}</strong> ({contact.email}): {contact.message}
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  return (
    <div className="admin-dashboard-wrapper">
      <aside className="admin-sidebar">
        <h2>Admin Menu</h2>
        <ul className="admin-menu-list">
          <li
            className={activePage === "bookings" ? "active" : ""}
            onClick={() => setActivePage("bookings")}
          >
            Bookings
          </li>
          <li
            className={activePage === "tickets" ? "active" : ""}
            onClick={() => setActivePage("tickets")}
          >
            Create Tickets
          </li>
          <li
            className={activePage === "users" ? "active" : ""}
            onClick={() => setActivePage("users")}
          >
            Users
          </li>
          <li
            className={activePage === "messages" ? "active" : ""}
            onClick={() => setActivePage("messages")}
          >
            Messages
          </li>
          <li
            className="logout-button"
            onClick={() => navigate("/")}
          >
            Logout
          </li>
        </ul>
      </aside>
      <main className="admin-main-content">
        {activePage === "bookings" && renderBookings()}
        {activePage === "tickets" && renderTickets()}
        {activePage === "users" && renderUsers()}
        {activePage === "messages" && renderMessages()}
      </main>
    </div>
  );
};

export default AdminDashboard;
