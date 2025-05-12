import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { QRCodeCanvas } from "qrcode.react";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import UserDashboardLayout from "./UserDashboardLayout";
import "./ScanToPay.css";

const ScanToPayPage = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("User");
  const [paymentUrl, setPaymentUrl] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/signup-login");
      return;
    }

    const fetchUserName = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUsername(data.name || user.displayName || "User");
        } else {
          setUsername(user.displayName || "User");
        }
      } catch {
        setUsername(user.displayName || "User");
      }
    };

    fetchUserName();

    const data = localStorage.getItem("scanToPayData");
    if (data) {
      const paymentDataParsed = JSON.parse(data);
      setPaymentData(paymentDataParsed);

      // Fetch payment URL from backend
      fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentDataParsed.totalCost,
          item_name: paymentDataParsed.title,
          buyer_email: user.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.paymentUrl) {
            setPaymentUrl(data.paymentUrl);
          } else {
            alert("Failed to get payment URL. Please try again.");
            navigate("/user-dashboard");
          }
        })
        .catch(() => {
          alert("Failed to get payment URL. Please try again.");
          navigate("/user-dashboard");
        });
    } else {
      alert("No payment data found. Please book again.");
      navigate("/user-dashboard");
    }
    setLoading(false);
  }, [navigate, user]);

  const handleConfirmPayment = async () => {
    if (!paymentData) return;

    try {
      await addDoc(collection(db, "transactions"), {
        userId: paymentData.userId,
        ticketId: paymentData.ticketId,
        title: paymentData.title,
        ticketType: paymentData.selectedType,
        quantity: paymentData.quantity,
        totalCost: paymentData.totalCost,
        contact: paymentData.contact,
        status: "Paid",
        timestamp: new Date(),
      });

      alert("Payment confirmed! Ticket details sent to your email or phone.");
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Failed to confirm payment. Please try again.");
    }
  };

  if (loading || !paymentData) return <p>Loading...</p>;

  const qrValue = paymentUrl || "";

  return (
    <UserDashboardLayout username={username} onLogout={() => auth.signOut().then(() => navigate("/"))}>
      <div className="scan-to-pay-page">
        <h2>Scan to Pay</h2>
        <p><strong>Event:</strong> {paymentData.title}</p>
        <p><strong>Ticket Type:</strong> {paymentData.selectedType}</p>
        <p><strong>Quantity:</strong> {paymentData.quantity}</p>
        <p><strong>Total Cost:</strong> R{paymentData.totalCost}</p>
        <p><strong>Scan the QR code with your banking app to complete payment:</strong></p>

        <div style={{ margin: "20px auto", width: 200 }}>
          {qrValue ? (
            <QRCodeCanvas value={qrValue} size={200} />
          ) : (
            <p>Loading payment QR code...</p>
          )}
        </div>

        <p>After completing payment, click below to confirm:</p>
        <button onClick={handleConfirmPayment} style={{ padding: "10px 20px", cursor: "pointer" }}>
          I've Paid – Confirm Now
        </button>
      </div>
    </UserDashboardLayout>
  );
};

export default ScanToPayPage;
