// // src/components/PaymentSuccess.js
// import React, { useEffect, useState } from "react";
// import { addDoc, collection, Timestamp } from "firebase/firestore";
// import { db } from "../firebase";
// import emailjs from "emailjs-com";
// import { QRCodeCanvas } from "qrcode.react";

// const PaymentSuccess = () => {
//   const [message, setMessage] = useState("Processing payment...");
//   const [qrCode, setQRCode] = useState("");

//   useEffect(() => {
//     const completePayment = async () => {
//       const paymentData = JSON.parse(localStorage.getItem("paymentData"));

//       if (!paymentData) {
//         setMessage("No payment data found.");
//         return;
//       }

//       const { ticketId, title, selectedType, quantity, contact, totalCost, orderId } = paymentData;

//       try {
//         await addDoc(collection(db, "purchases"), {
//           ticketId,
//           title,
//           type: selectedType,
//           quantity,
//           totalCost,
//           contact,
//           confirmationCode: orderId,
//           createdAt: Timestamp.now()
//         });

//         if (contact.includes("@")) {
//           await emailjs.send("service_a39yx6k", "template_0fqfq69", {
//             to_email: contact,
//             ticket_title: title,
//             ticket_type: selectedType,
//             quantity,
//             confirmation_code: orderId
//           }, "8fL_-a01ZKFqmg1xK");
//         }

//         setQRCode(orderId);
//         setMessage(`Payment successful! Confirmation sent to ${contact}`);
//         localStorage.removeItem("paymentData");
//       } catch (error) {
//         console.error("Error completing payment:", error);
//         setMessage("Payment failed. Please contact support.");
//       }
//     };

//     completePayment();
//   }, []);

//   return (
//     <div className="payment-success">
//       <h2>{message}</h2>
//       {qrCode && (
//         <div>
//           <h3>Your Ticket QR Code</h3>
//           <QRCodeCanvas value={qrCode} size={150} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccess;

// src/components/PaymentSuccess.js
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { QRCodeCanvas } from "qrcode.react";
// import emailjs from "emailjs-com";
// import { addDoc, collection, Timestamp } from "firebase/firestore";
// import { db } from "../firebase";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const location = useLocation();
//   const [qrCode, setQRCode] = useState("");
//   const [message, setMessage] = useState("Processing payment...");

//   useEffect(() => {
//     const { ticketId, title, selectedType, quantity, contact, totalCost } = location.state;

//     // Generate the confirmation code
//     const confirmationCode = `CONF-${Date.now()}`;

//     // Save purchase data to Firestore
//     try {
//       addDoc(collection(db, "purchases"), {
//         ticketId,
//         title,
//         type: selectedType,
//         quantity,
//         totalCost,
//         contact,
//         confirmationCode,
//         createdAt: Timestamp.now()
//       });

//       // Send email confirmation using EmailJS
//       emailjs.send("service_a39yx6k", "template_0fqfq69", {
//         to_email: contact,
//         ticket_title: title,
//         ticket_type: selectedType,
//         quantity,
//         confirmation_code: confirmationCode
//       }, "8fL_-a01ZKFqmg1xK");

//       setQRCode(confirmationCode);
//       setMessage(`Payment successful! Confirmation has been sent to ${contact}.`);

//     } catch (error) {
//       console.error("Payment handling failed:", error);
//       setMessage("Payment failed. Please contact support.");
//     }
//   }, [location.state]);

//   return (
//     <div className="payment-success-container">
//       <h2>{message}</h2>
//       {qrCode && (
//         <div>
//           <h3>Your Ticket QR Code</h3>
//           <QRCodeCanvas value={qrCode} size={150} />
//           <p>Scan this code at the event entrance.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccess;

// src/components/PaymentSuccess.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import emailjs from "emailjs-com";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const [qrCode, setQRCode] = useState("");
  const [message, setMessage] = useState("Processing...");

  useEffect(() => {
    const {
      ticketId,
      title,
      selectedType,
      quantity = 1,
      totalCost,
      contact
    } = location.state || {};

    if (!contact) {
      setMessage("Missing contact info.");
      return;
    }

    const confirmationCode = "CONF-" + Date.now();

    const saveAndNotify = async () => {
      try {
        await addDoc(collection(db, "purchases"), {
          ticketId,
          title,
          type: selectedType,
          quantity,
          totalCost,
          contact,
          confirmationCode,
          createdAt: Timestamp.now()
        });

        if (contact.includes("@")) {
          await emailjs.send("service_a39yx6k", "template_0fqfq69", {
            to_email: contact,
            ticket_title: title,
            ticket_type: selectedType,
            quantity,
            confirmation_code: confirmationCode
          }, "8fL_-a01ZKFqmg1xK");
        }

        setQRCode(confirmationCode);
        setMessage(`Success! Confirmation sent to ${contact}`);
      } catch (error) {
        console.error("Error completing transaction:", error);
        setMessage("Failed to process. Contact support.");
      }
    };

    saveAndNotify();
  }, [location.state]);

  return (
    <div className="payment-success-container">
      <h2>{message}</h2>
      {qrCode && (
        <div>
          <h3>Your Ticket QR Code</h3>
          <QRCodeCanvas value={qrCode} size={160} />
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
